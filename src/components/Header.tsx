'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setCartItems, setLocalCartItems } from '@/libs/reducers/cartReducer'
import { getCartApi, updateProductsInLocalCartApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaBars, FaCartShopping } from 'react-icons/fa6'
import { HiLightningBolt } from 'react-icons/hi'
import { IoChevronDown } from 'react-icons/io5'
import Menu from './Menu'
import { FullyProduct } from '@/app/api/product/[slug]/route'
import { FullyCartItem } from '@/app/api/cart/route'

interface HeaderProps {
  isStatic?: boolean
}

function Header({ isStatic }: HeaderProps) {
  // hook
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(state => state.cart.items)
  const localCartItems = useAppSelector(state => state.cart.localItems)
  const { data: session, update } = useSession()

  // states
  const [curUser, setCurUser] = useState<any>(session?.user)
  const [isShow, setIsShow] = useState<boolean>(false)
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
  const lastScrollTop = useRef(0)
  const [cartLength, setCartlength] = useState<number>(0)
  const [isLocalCartUpdated, setIsLocalCartUpdated] = useState<boolean>(false)

  // get user session
  useEffect(() => {
    const getCurUser = async () => {
      console.log('re-get user session')
      const session = await getSession()
      setCurUser(session?.user)

      await update()
    }

    if (!curUser?._id) {
      getCurUser()
    }
  }, [curUser?._id, update])

  // update products in local cart
  useEffect(() => {
    const getCorrespondingProducts = async () => {
      try {
        // send product ids to get corresponding cart items
        const { products } = await updateProductsInLocalCartApi(
          localCartItems.map(item => item.product._id)
        )

        const updatedLocalCartItems = localCartItems
          .map(cartItem => {
            const product = products.find(
              (product: FullyProduct) => product._id === cartItem.product._id
            )

            return product
              ? {
                  ...cartItem,
                  product,
                }
              : null
          })
          .filter(cartItem => cartItem) as FullyCartItem[]

        console.log('updatedLocalCartItems: ', updatedLocalCartItems)

        dispatch(setLocalCartItems(updatedLocalCartItems))
        setIsLocalCartUpdated(true)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    if (!curUser?._id && !isLocalCartUpdated) {
      getCorrespondingProducts()
    }
  }, [curUser?._id, dispatch, localCartItems, isLocalCartUpdated])

  // get cart length
  useEffect(() => {
    setCartlength(
      curUser?._id
        ? cartItems.reduce((total, item) => total + item.quantity, 0)
        : localCartItems.reduce((total, item) => total + item.quantity, 0)
    )
  }, [cartItems, localCartItems, curUser?._id])

  // get user's cart
  useEffect(() => {
    const getUserCart = async () => {
      if (curUser?._id) {
        try {
          // send request to get user's cart
          const { cart } = await getCartApi() // cache: no-store

          // set cart to state
          dispatch(setCartItems(cart))
        } catch (err: any) {
          console.log(err)
          toast.error(err.response.data.message)
        }
      }
    }
    getUserCart()
  }, [dispatch, curUser?._id])

  // handle show and hide header on scroll
  useEffect(() => {
    const handleScroll = () => {
      let scrollTop = window.scrollY

      // scroll down
      if (scrollTop >= 21) {
        // scroll top
        if (scrollTop > lastScrollTop.current) {
          setIsShow(true)
        } else {
          setIsShow(false)
          setIsOpenMenu(false)
        }

        lastScrollTop.current = scrollTop
      } else {
        setIsShow(false)
        setIsOpenMenu(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  return (
    <header
      className={`${
        isStatic ? 'static' : 'fixed z-50 left-0 top-0'
      } bg-dark-100 w-full text-light shadow-medium-light transition-all duration-300 ${
        isShow ? 'top-0' : 'top-[-100%]'
      }`}>
      {/* Main Header */}
      <div className='relative flex justify-between items-center max-w-1200 w-full h-[72px] m-auto px-21'>
        {/* Brand */}
        <div className='flex items-center max-w-[300px] w-[90%] overflow-x-scroll no-scrollbar'>
          <Link
            href='/'
            className='hidden sm:block shrink-0 rounded-full common-transition hover:shadow-medium-light'>
            <Image
              className='aspect-square rounded-full'
              src='/images/logo.jpg'
              width={40}
              height={40}
              alt='logo'
            />
          </Link>
          <Link href='/' className='text-2xl font-bold'>
            .AnphaShop
          </Link>
          <Link
            href='/recharge'
            className='flex ml-3 bg-primary px-[10px] py-[6px] rounded-lg items-center gap-1 group hover:bg-secondary common-transition'>
            <span className='font-bold font-body text-[18px] tracking-[0.02em] group-hover:text-white common-transition'>
              Nạp
            </span>
            <HiLightningBolt
              size={20}
              className='animate-bounce group-hover:text-white common-transition'
            />
          </Link>
        </div>

        {/* Nav */}
        <div className='hidden md:flex items-center gap-4'>
          <Link href='/cart' className='relative hover:scale-110 common-transition'>
            <FaCartShopping size={24} />
            {!!cartLength && (
              <span className='absolute -top-2 right-[-5px] bg-primary rounded-full text-center px-[6px] py-[2px] text-[10px] font-bold'>
                {cartLength}
              </span>
            )}
          </Link>

          {curUser ? (
            !!curUser._id && (
              <div
                className='group flex items-center gap-2 cursor-pointer'
                onClick={() => setIsOpenMenu(prev => !prev)}>
                <Image
                  className='aspect-square rounded-full'
                  src={curUser?.avatar || '/images/default-avatar.jpg'}
                  width={40}
                  height={40}
                  alt='avatar'
                />
                <div className='text-[18px] font-body hover:underline underline-offset-2'>
                  {formatPrice(curUser?.balance)}
                </div>
                <IoChevronDown size={22} className='common-transition hover:scale-125' />
              </div>
            )
          ) : (
            <Link
              href='/auth/login'
              className='bg-secondary hover:bg-primary text-nowrap common-transition px-[10px] py-[6px] rounded-extra-small font-body font-semibold tracking-wider cursor-pointer'>
              Đăng nhập
            </Link>
          )}
        </div>

        <div className='md:hidden flex items-center' onClick={() => setIsOpenMenu(prev => !prev)}>
          <button className='flex justify-center items-center w-[40px] h-[40px]'>
            <FaBars size={22} className='common-transition hover:scale-110' />
          </button>
        </div>

        {/* Menu */}
        <Menu open={isOpenMenu} setOpen={setIsOpenMenu} />
      </div>
    </header>
  )
}

export default Header
