import { ICostGroup } from '@/models/CostGroupModel'
import { addCostGroupApi, deleteCostGroupsApi, updateCostGroupApi } from '@/requests'
import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaPlus, FaSave, FaTrash } from 'react-icons/fa'
import { MdCancel, MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from './ConfirmDialog'

interface CostGroupAreaProps {
  costGroups: ICostGroup[]
  setCostGroups: Dispatch<SetStateAction<ICostGroup[]>>
  className?: string
}

function CostGroupArea({ costGroups, setCostGroups, className = '' }: CostGroupAreaProps) {
  // states
  const [openCostGroup, setOpenCostGroup] = useState<boolean>(false)
  const [selectedCostGroups, setSelectedCostGroups] = useState<ICostGroup[]>(costGroups)

  const [title, setTitle] = useState<string>('')
  const [adding, setAdding] = useState<boolean>(false)
  const [editCostGroup, setEditCostGroup] = useState<ICostGroup | null>(null)
  const [editing, setEditing] = useState<boolean>(false)
  const [deleteCostGroup, setDeleteCostGroup] = useState<ICostGroup | null>(null)
  const [deleting, setDeleting] = useState<boolean>(false)
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // handle add new cost group
  const handleAddCostGroup = useCallback(async () => {
    // start adding
    setAdding(true)

    try {
      // send request to server
      const { costGroup } = await addCostGroupApi({ title })

      // update cost groups
      setCostGroups(prev => [costGroup, ...prev])

      // reset
      setTitle('')
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setAdding(false)
    }
  }, [setCostGroups, title])

  // handle edit cost group
  const handleEditCostGroup = useCallback(async () => {
    if (!editCostGroup || editCostGroup.title === title.trim()) return

    // start editing
    setEditing(true)

    try {
      // send request to server
      const { updatedCostGroup } = await updateCostGroupApi(editCostGroup._id, { title })

      // update cost groups
      setCostGroups(prev =>
        prev.map(group => (group._id === updatedCostGroup._id ? updatedCostGroup : group))
      )

      // reset
      setTitle('')
      setEditCostGroup(null)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop editing
      setEditing(false)
    }
  }, [setCostGroups, editCostGroup, title])

  // handle delete cost group
  const handleDeleteCostGroup = useCallback(async () => {
    if (!deleteCostGroup) return

    // start deleting
    setDeleting(true)

    try {
      // send request to server
      const { deletedCostGroups } = await deleteCostGroupsApi([deleteCostGroup._id])

      // update cost groups
      setCostGroups(prev =>
        prev.filter(group => !deletedCostGroups.some((g: any) => g._id === group._id))
      )

      // reset
      setDeleteCostGroup(null)
      setIsOpenConfirmModal(false)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop editing
      setDeleting(false)
    }
  }, [setCostGroups, deleteCostGroup])

  return (
    <>
      {openCostGroup && (
        <div
          className="fixed left-0 top-0 z-10 h-full w-full"
          onClick={() => {
            setOpenCostGroup(false)
          }}
        />
      )}

      <div className={`relative ${className}`}>
        <button
          className="trans-200 rounded-md px-2 py-1.5 text-xs font-semibold shadow-md hover:bg-slate-100"
          onClick={() => setOpenCostGroup(!openCostGroup)}
        >
          {selectedCostGroups.length} {selectedCostGroups.length !== 1 ? 'groups' : 'group'}
        </button>

        <AnimatePresence>
          {openCostGroup && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute left-0 top-[calc(100%+10.5px)] z-10 flex max-h-[400px] max-w-[calc(100vw-2*21px)] flex-col gap-0.5 overflow-y-auto rounded-md bg-white shadow-md"
            >
              <div className="flex h-8 overflow-hidden rounded-md border-2 border-dark">
                <input
                  name="title"
                  type="text"
                  className="h-full px-3 text-xs font-semibold text-dark outline-none"
                  disabled={false}
                  value={title}
                  required
                  onChange={e => setTitle(e.target.value)}
                  placeholder="New group..."
                  onKeyDown={e =>
                    e.key === 'Enter' && (editCostGroup ? handleEditCostGroup() : handleAddCostGroup())
                  }
                />
                <button
                  className="trans-200 group flex w-8 items-center justify-center bg-slate-100 hover:bg-slate-200"
                  onClick={() => (editCostGroup ? handleEditCostGroup() : handleAddCostGroup())}
                >
                  {adding || editing ? (
                    <RiDonutChartFill
                      size={14}
                      className="animate-spin text-slate-500"
                    />
                  ) : editCostGroup ? (
                    <FaSave
                      size={12}
                      className="wiggle text-green-500"
                    />
                  ) : (
                    <FaPlus
                      size={12}
                      className="wiggle"
                    />
                  )}
                </button>
              </div>

              <button
                className={`trans-200 trans-200 mt-1 px-3 py-1 text-left font-body text-xs font-semibold tracking-wider hover:bg-slate-100 ${
                  selectedCostGroups.length === costGroups.length ? 'border-l-2 border-primary pl-2' : ''
                }`}
                onClick={() =>
                  selectedCostGroups.length === costGroups.length
                    ? setSelectedCostGroups([])
                    : setSelectedCostGroups(costGroups)
                }
              >
                <span className="text-nowrap">All</span>
              </button>
              {costGroups.map((group, index) => (
                <button
                  className={`trans-200 trans-200 flex h-6 items-center justify-between gap-1.5 text-left font-body text-xs font-semibold tracking-wider hover:bg-slate-100 ${
                    selectedCostGroups.some(g => g._id.toString() === group._id.toString())
                      ? 'border-l-2 border-primary pl-2'
                      : 'pl-3'
                  }`}
                  onClick={() =>
                    setSelectedCostGroups((prev: any) =>
                      prev.some((g: any) => g._id.toString() === group._id.toString())
                        ? prev.filter((g: any) => g._id.toString() !== group._id.toString())
                        : [...prev, group]
                    )
                  }
                  key={index}
                >
                  <p className="flex-1 text-nowrap">{group.title}</p>

                  {/* Edit & Delete Buttons */}
                  <div className="flex h-full">
                    <button
                      className="trans-200 group flex h-full w-8 items-center justify-center bg-slate-100 hover:bg-slate-200"
                      onClick={e => {
                        e.stopPropagation()
                        if (editCostGroup?._id === group._id) {
                          setEditCostGroup(null)
                          setTitle('')
                        } else {
                          setEditCostGroup(group)
                          setTitle(group.title)
                        }
                      }}
                    >
                      {editCostGroup?._id === group._id ? (
                        <MdCancel
                          size={14}
                          className="wiggle text-slate-600"
                        />
                      ) : (
                        <MdEdit
                          size={12}
                          className="wiggle text-sky-500"
                        />
                      )}
                    </button>
                    <button
                      className="trans-200 group flex h-full w-8 items-center justify-center bg-slate-100 hover:bg-slate-200"
                      onClick={e => {
                        e.stopPropagation()
                        setDeleteCostGroup(group)
                        setIsOpenConfirmModal(true)
                      }}
                    >
                      {deleteCostGroup?._id === group._id && deleting ? (
                        <RiDonutChartFill
                          size={14}
                          className="animate-spin text-slate-500"
                        />
                      ) : (
                        <FaTrash
                          size={12}
                          className="wiggle text-rose-500"
                        />
                      )}
                    </button>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <ConfirmDialog
          open={isOpenConfirmModal}
          setOpen={setIsOpenConfirmModal}
          title={`Delete ${deleteCostGroup?.title} group`}
          content={`Are you sure that you want to delete this group?`}
          onAccept={handleDeleteCostGroup}
          isLoading={deleting}
          color="rose"
          containerClassName="!h-full !w-full"
          cancelLabel="Cancel"
          acceptLabel="Delete"
        />
      </div>
    </>
  )
}

export default memo(CostGroupArea)
