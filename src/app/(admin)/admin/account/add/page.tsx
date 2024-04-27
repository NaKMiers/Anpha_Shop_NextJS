'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { FullyProduct } from '@/app/api/product/[slug]/route'
import Divider from '@/components/Divider'
import AdminHeader from '@/components/admin/AdminHeader'
import AddAccountForm from '@/components/admin/forms/AddAccountForm'
import { getForceAllProductsApi } from '@/requests'
import toast from 'react-hot-toast'
import { ProductWithTagsAndCategory } from '../../product/all/page'

export type GroupTypes = {
  [key: string]: ProductWithTagsAndCategory[]
}

function AddAccountPage() {
  // states
  const [groupTypes, setGroupTypes] = useState<GroupTypes>({})
  const defaultValues = useMemo(
    () => ({
      id: new Date().getTime(),
      type: '',
      info: '',
      renew: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
      days: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
      active: true,
    }),
    []
  )
  const [forms, setForms] = useState<any[]>([defaultValues])

  // MARK: Get Data
  // get all types (products)
  useEffect(() => {
    const getAllTypes = async () => {
      try {
        // send request to server to get all products
        const { products } = await getForceAllProductsApi()

        // group product be category.title
        const groupTypes: GroupTypes = {}
        products.forEach((product: FullyProduct) => {
          if (!groupTypes[product.category.title]) {
            groupTypes[product.category.title] = []
          }
          groupTypes[product.category.title].push(product)
        })

        setGroupTypes(groupTypes)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getAllTypes()
  }, [])

  const handleAddForm = useCallback(() => {
    setForms(prev => [
      ...prev,
      {
        ...defaultValues,
        id: new Date().getTime(),
      },
    ])
  }, [setForms, defaultValues])

  const handleDuplicateForm = useCallback((form: any) => {
    setForms(prev => [
      ...prev,
      {
        ...form,
        id: new Date().getTime(),
      },
    ])
  }, [])

  const handleRemoveForm = useCallback((id: number) => {
    setForms(prev => prev.filter(form => form.id !== id))
  }, [])

  // MARK: Get Data
  // get all types (products)
  useEffect(() => {
    const getAllTypes = async () => {
      try {
        // send request to server to get all products
        const { products } = await getForceAllProductsApi()

        // group product be category.title
        const groupTypes: GroupTypes = {}
        products.forEach((product: FullyProduct) => {
          if (!groupTypes[product.category.title]) {
            groupTypes[product.category.title] = []
          }
          groupTypes[product.category.title].push(product)
        })

        setGroupTypes(groupTypes)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }
    getAllTypes()
  }, [])

  return (
    <div className='max-w-1200 mx-auto'>
      {/* MARK: Admin Header */}
      <AdminHeader title='Add Account' backLink='/admin/account/all' />

      <Divider size={2} />

      <div className='flex justify-center items-center gap-2'>
        <button
          className='rounded-lg shadow-lg px-3 py-2 font-semibold text-sm border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-white common-transition'
          onClick={handleAddForm}>
          New Form
        </button>
        {forms.length > 1 && (
          <button
            className='rounded-lg shadow-lg px-3 py-2 font-semibold text-sm border border-slate-300 text-slate-300 hover:bg-slate-300 hover:text-dark common-transition'
            onClick={() => setForms([defaultValues])}>
            Remove All
          </button>
        )}
      </div>

      <Divider size={5} />

      <div className={`grid grid-cols-1 ${forms.length > 1 ? 'md:grid-cols-2' : ''} gap-x-21 gap-y-10`}>
        {forms.map(form => (
          <AddAccountForm
            groupTypes={groupTypes}
            forms={forms}
            form={form}
            handleDuplicateForm={handleDuplicateForm}
            handleRemoveForm={handleRemoveForm}
            defaultValues={defaultValues}
            key={form.id}
          />
        ))}
      </div>
    </div>
  )
}

export default AddAccountPage
