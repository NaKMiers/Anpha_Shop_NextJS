import { FullyProduct } from '@/app/api/product/[slug]/route'
import ChooseMe from '@/components/ChooseMe'
import GroupProducts from '@/components/GroupProducts'
import LinkBar from '@/components/LinkBar'
import Price from '@/components/Price'
import Slider from '@/components/Slider'
import { IComment } from '@/models/CommentModel'
import { ITag } from '@/models/TagModel'
import axios from 'axios'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FaCartPlus, FaCircleCheck, FaMinus, FaPlus, FaTags } from 'react-icons/fa6'
import { TbPackages } from 'react-icons/tb'

export const metadata: Metadata = {
  title: 'Product',
  description:
    'Chào mừng bạn đến với Anpha Shop, địa chỉ tin cậy cho những người đang tìm kiếm Account Cao Cấp. Tại Anpha Shop, chúng tôi tự hào mang đến cho bạn những tài khoản chất lượng và đẳng cấp, đáp ứng mọi nhu cầu của bạn. Khám phá bộ sưu tập Account Cao Cấp tại cửa hàng của chúng tôi ngay hôm nay và trải nghiệm sự khác biệt với Anpha Shop - Nơi đáng tin cậy cho sự đẳng cấp!',
}

async function ProductPage({ params: { slug } }: { params: { slug: string } }) {
  let product: FullyProduct | null = null
  let relatedProducts: FullyProduct[] = []
  let comments: IComment[] = []

  try {
    const res = await axios.get(`${process.env.APP_URL}/api/product/${slug}`)
    product = res.data.product
    relatedProducts = res.data.relatedProducts
    comments = res.data.comments

    console.log('res: ---', res.data)
  } catch (err: any) {
    // redirect home
    redirect('/')
  }

  return (
    <div className='pt-9'>
      <section className='bg-white p-8 flex flex-col gap-21 md:flex-row rounded-medium shadow-medium'>
        {/* Thumbnails */}
        <div className='w-full md:w-[45%] md:max-w-[500px]'>
          <div className='aspect-video shadow-xl rounded-md'>
            <Slider>
              {product?.images.map(src => (
                <Image
                  className='w-full h-full object-cover'
                  src={src}
                  width={1200}
                  height={768}
                  alt='product'
                  key={src}
                />
              ))}
            </Slider>
          </div>

          {/* Link */}
          <LinkBar className='mt-21' link={`${process.env.APP_URL}/${slug}`} />
        </div>

        <div className='md:w-[55%]'>
          {/* Basic Product Info */}
          <h1 className='text-[28px] text-dark font-semibold mb-3' title={product?.title}>
            {product?.title}
          </h1>

          <Price price={product?.price || 0} oldPrice={product?.oldPrice} />

          <div className='flex flex-col gap-3 text-xl font-body tracking-wide mt-5'>
            <div className='flex items-center gap-1'>
              <TbPackages className='w-7 text-darker' size={26} />
              <span className='text-darker font-bold text-nowrap'>Còn lại:</span>
              <span className='text-green-500'>{product?.stock}</span>
            </div>
            <div className='flex items-center gap-1 flex-wrap'>
              <FaTags className='w-7 text-darker' size={20} />
              <span className='text-darker font-bold text-nowrap'>Thể loại:</span>
              {product?.tags.map((tag: ITag, index) => (
                <Link href={`/tags?ctg=${tag.slug}`} className='text-dark' key={tag.slug}>
                  {tag.title + (index !== product!.tags.length - 1 ? ', ' : '')}
                </Link>
              ))}
            </div>
            <div className='flex items-center gap-1'>
              <FaCircleCheck className='w-7 text-darker' size={20} />
              <span className='text-darker font-bold text-nowrap'>Đã bán:</span>
              <span className='text-primary'>{product?.sold}</span>
            </div>
          </div>

          {/* Quantity */}
          <div className='inline-flex border-[1.5px] border-secondary rounded-md overflow-hidden my-3'>
            <button className='flex items-center justify-center px-3 py-[10px] group hover:bg-secondary common-transition'>
              <FaMinus
                size={16}
                className='text-secondary group-hover:text-white group-hover:scale-110 common-transition'
              />
            </button>
            <input
              className='max-w-14 px-2 outline-none text-center text-lg text-dark font-semibold font-body border-x-[1.5px] border-secondary'
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
            />
            <button className='flex items-center justify-center px-3 py-[10px] group hover:bg-secondary common-transition'>
              <FaPlus
                size={16}
                className='text-secondary group-hover:text-white group-hover:scale-110 common-transition'
              />
            </button>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center flex-row-reverse md:flex-row justify-start gap-3 mt-1'>
            <button className='bg-secondary rounded-md text-white text-xl px-3 py-[5px] font-semibold font-body hover:bg-primary common-transition'>
              MUA NGAY
            </button>
            <button className='bg-primary px-3 py-2 rounded-md'>
              <FaCartPlus size={22} className='text-white' />
            </button>
          </div>
        </div>
      </section>

      <div className='pt-9' />

      <section className='max-w-1200 mx-auto bg-dark-100 border-4 border-white p-8 rounded-medium shadow-medium overflow-hidden'>
        <GroupProducts products={relatedProducts} hideTop />
      </section>

      <div className='pt-9' />

      <section className='max-w-1200 mx-auto bg-white p-8 rounded-medium shadow-medium'>
        <div className='flex flex-wrap w-full -mx-21/2'>
          <div className='w-full px-21/2 mb-12'>
            <h3 className='text-[28px] text-dark'>Giới thiệu sản phẩm</h3>
            <p className='font-semibold text-lg font-body mb-1'>
              Chào mừng bạn đến với <span className='text-red-500'>Netflix</span> - Ứng dụng giải trí số
              1 thế giới!
            </p>
            <p className='font-semibold text-lg font-body leading-6'>
              Khám phá thế giới phim và series truyền hình độc đáo, đỉnh cao với
              <span className='text-red-500'>Netflix</span> . Đặc biệt, bạn sẽ được tận hưởng trải nghiệm
              xem phim linh hoạt trên mọi thiết bị. Hãy bắt đầu hành trình giải trí của bạn ngay hôm nay
              và không bỏ lỡ những thước phim độc quyền chỉ có tại
              <span className='text-red-500'>Netflix</span> . 🍿🌟🎬
            </p>
          </div>

          <div className='inline-block w-full md:w-1/2 px-21/2 mb-12'>
            <h3 className='text-[28px] text-dark'>Mô tả sản phẩm</h3>
            <p>
              <span>Tên gói: </span>
              <span className='font-semibold'>
                Netflix Premium (Gói Share 1 Tháng) - Chia Sẻ Niềm Vui Xem Phim Siêu Nét
              </span>
            </p>
            <p>
              <span>Hạn sử dụng: </span>
              <span className='font-semibold'>30 ngày kể từ khi được cấp tài khoản.</span>
            </p>
            <ul>
              <li>- Mỗi profile trong tài khoản sẽ được chia ra có từ 1 - 3 người dùng.</li>
              <li>
                - Không giới hạn số lượng thiết bị đăng nhập, tuy nhiên không được xem trên nhiều thiết
                bị cùng lúc.
              </li>
            </ul>
            <p>
              <span>Lưu ý: </span>
              <span className='font-semibold'>
                Không được phép thay đổi thông tin tài khoản, nếu không tài khoản của bạn sẽ bị thu hồi.
              </span>
            </p>
          </div>

          <div className='inline-block w-full md:w-1/2 px-21/2 mb-12'>
            <h3 className='text-[28px] text-dark'>Cách thức mua hàng</h3>
            <ul>
              <li className='mb-4'>
                <span className='font-semibold'>Cách 1: </span>
                <div>- Mua hàng thông qua Momo</div>
              </li>
              <li className='mb-4'>
                <span className='font-semibold'>Cách 2: </span>
                <div>- Mua hàng thông qua Ngân hàng</div>
              </li>
              <li className='mb-4'>
                <span className='font-semibold'>Cách 3: </span>
                <div>
                  -{' '}
                  <Link href='/user/recharge' className='text-sky-5000 underline'>
                    Nạp tiền vào tài khoản
                  </Link>{' '}
                  sau đó mua hàng.
                </div>
              </li>
            </ul>
          </div>

          <div className='inline-block w-full md:w-1/2 px-21/2 mb-12'>
            <h3 className='text-[28px] text-dark'>Bảo hành & Đền bù</h3>
            <p>
              <span className='font-semibold'>Thời gian bảo hành: </span>
              <span>
                bằng thời gian sử dụng của tài khoản (Ví dụ: mua Canva 1 năm thì hạn bảo hành sẽ là 1
                năm)
              </span>
            </p>
            <p className='font-semibold'>Hình thức bảo hành:</p>
            <ul className='list-decimal pl-10'>
              <li>
                Nếu không thể đăng nhập:
                <ul className='list-disc pl-6'>
                  <li>Tài khoản sẽ được sửa chữa trong 12h.</li>
                  <li>Được cấp tài khoản thay để dùng tạm thời trong thời gian sửa lỗi.</li>
                  <li>
                    Nếu thời gian sửa lỗi vượt 12h bạn sẽ được tặng voucher giảm 10% cho lần mua tiếp
                    theo. .
                  </li>
                </ul>
              </li>
              <li>
                Được cấp lại tài khoản mới:
                <ul className='list-disc pl-6'>
                  <li>Lỗi không thể sửa được.</li>
                  <li>
                    Tài khoản hết hạn trước 50% thời gian sử dụng (Ví dụ: mua Netflix 30 ngày nhưng lại
                    hết hạn trước ngày thứ 15)
                  </li>
                </ul>
              </li>
            </ul>
            <p className='font-semibold'>Hình thức bảo hành:</p>
            <ul className='list-disc pl-10'>
              <li>
                Nếu dùng dưới 5 ngày: Đền bù voucher giảm 100% cho đơn hàng có giá tối thiểu bằng đơn
                hàng hiện tại.
              </li>
              <li>
                Nếu dùng trên từ 5 ngày trở lên: Đền bù voucher giảm 50% cho đơn hàng có giá tối thiểu
                bằng đơn hàng hiện tại.
              </li>
            </ul>
            <p className='font-semibold'>Miễn trừ trách nhiệm:</p>
            <ul className='list-disc pl-10'>
              <li>Chúng tôi không có chính sách miễn trừ trách nhiệm.</li>
              <li>
                Chúng tôi luôn cố gắng hết sức đảm bảo quyền lợi của khách hàng dưới bất kì hình thức
                nào.
              </li>
            </ul>
            <p>
              - Liên hệ người bán tại{' '}
              <a
                href='https://m.me/anphashopacc'
                className='text-sky-5000 underline'
                target='_blank'
                rel='noreferrer'>
                Messenger
              </a>{' '}
              hoặc{' '}
              <a
                href='https://zalo.me/0899320427'
                className='text-sky-5000 underline'
                target='_blank'
                rel='noreferrer'>
                Zalo
              </a>
            </p>
          </div>

          <div className='inline-block w-full md:w-1/2 px-21/2 mb-12'>
            <h3 className='text-[28px] text-dark'>Các câu hỏi thường gặp:</h3>
            <ul className='list-decimal pl-10'>
              <li>
                <p className='font-semibold'>Có thể đổi mã pin profile được không?</p>
                <p>
                  Được! Bạn không chỉ có thể đổi mã pin profile mà còn có thể đổi avatar và ngôn ngữ.
                </p>
                <p>
                  *Tuy nhiên tuyệt đối không được đổi tên profile, nếu không bạn sẽ bị thu hồi tài khoản.
                </p>
              </li>
              <li>
                <p className='font-semibold'>
                  Bị quá tải thiết bị trong quá trình sử dụng (Đối với các account shared) thì làm sao?
                </p>
                <p>
                  Hãy chờ trong khoảng 1 - 2 tiếng sau đó quay lại hoặc liên hệ người bán thông qua{' '}
                  <a
                    href='https://m.me/anphashopacc'
                    className='text-sky-5000 underline'
                    target='_blank'
                    rel='noreferrer'>
                    Messenger
                  </a>{' '}
                  hoặc{' '}
                  <a
                    href='https://zalo.me/0899320427'
                    className='text-sky-5000 underline'
                    target='_blank'
                    rel='noreferrer'>
                    Zalo
                  </a>
                  {''}
                  để được xử lí trong thời gian sớm nhất
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className='mb-10'>
          <h3 className='w-full text-dark text-[28px] tracking-wide'>Tại sao chọn tôi</h3>

          <ChooseMe />
        </div>
      </section>
    </div>
  )
}

export default ProductPage
