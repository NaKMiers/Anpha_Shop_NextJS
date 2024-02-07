import GroupProducts from './GroupProducts'
import Heading from './Heading'

interface BestSellerProps {}

function BestSeller({}: BestSellerProps) {
  return (
    <div className='max-w-1200 mx-auto'>
      <Heading title='Top #10' />

      <GroupProducts />
    </div>
  )
}

export default BestSeller
