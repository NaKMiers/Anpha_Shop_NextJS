import { FaTicketAlt } from 'react-icons/fa'
import { FaBoltLightning, FaCubes, FaGift, FaListCheck, FaTags, FaUser } from 'react-icons/fa6'
import { MdCategory } from 'react-icons/md'
import { RiBillFill } from 'react-icons/ri'

export const redPathnameList = ['/auth']

export const adminLinks = [
  {
    title: 'Order',
    icon: RiBillFill,
    links: [
      {
        title: 'All Orders',
        href: '/admin/order/all',
      },
    ],
  },
  {
    title: 'Account',
    icon: FaGift,
    links: [
      {
        title: 'All Accounts',
        href: '/admin/account/all',
      },
      {
        title: 'Add Account',
        href: '/admin/account/add',
      },
    ],
  },
  {
    title: 'User',
    icon: FaUser,
    links: [
      {
        title: 'All Users',
        href: '/admin/user/all',
      },
    ],
  },
  {
    title: 'Summary',
    icon: FaListCheck,
    links: [
      {
        title: 'All Summaries',
        href: '/admin/summary/all',
      },
      {
        title: 'Add Summary',
        href: '/admin/summary/add',
      },
    ],
  },
  {
    title: 'Product',
    icon: FaCubes,
    links: [
      {
        title: 'All Products',
        href: '/admin/product/all',
      },
      {
        title: 'Add Product',
        href: '/admin/product/add',
      },
    ],
  },
  {
    title: 'Tag',
    icon: FaTags,
    links: [
      {
        title: 'All Tags',
        href: '/admin/tag/all',
      },
      {
        title: 'Add Tag',
        href: '/admin/tag/add',
      },
    ],
  },
  {
    title: 'Category',
    icon: MdCategory,
    links: [
      {
        title: 'All Categories',
        href: '/admin/category/all',
      },
      {
        title: 'Add Category',
        href: '/admin/category/add',
      },
    ],
  },
  {
    title: 'Voucher',
    icon: FaTicketAlt,
    links: [
      {
        title: 'All Vouchers',
        href: '/admin/voucher/all',
      },
      {
        title: 'Add Voucher',
        href: '/admin/voucher/add',
      },
    ],
  },
  {
    title: 'Flash Sale',
    icon: FaBoltLightning,
    links: [
      {
        title: 'All Flash Sales',
        href: '/admin/flash-sale/all',
      },
      {
        title: 'Add Flash Sale',
        href: '/admin/flash-sale/add',
      },
    ],
  },
]
