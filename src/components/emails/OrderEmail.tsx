import { formatPrice } from '@/utils/number'
import { Body, Column, Container, Img, Row, Section, Tailwind, Text } from '@react-email/components'

export function OrderEmail({ order }: { order: any }) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              primary: '#01dbe5',
              secondary: '#7655e6',
              dark: '#333',
              light: '#fff',
              loading: '#334155',
            },
            fontFamily: {
              sans: ['Montserrat', 'sans-serif'],
              body: ['Source Sans Pro', 'sans-serif'],
            },
            spacing: {
              21: '21px',
              '21/2': '10.5px',
            },
            maxWidth: {
              1200: '1200px',
            },
            borderRadius: {
              large: '24px',
              medium: '16px',
              small: '12px',
              'extra-small': '6px',
            },
            backgroundColor: {
              dark: {
                100: '#2f2e3e',
                200: '#003e70',
              },
              light: {
                100: '#f4f4f4',
                200: '#fff',
              },
            },
            textColor: {
              light: '#fff',
              darker: '#003e70',
              dark: '#333',
            },
            boxShadow: {
              'medium-light': '0px 2px 10px 1px rgba(255, 255, 255, 0.1)',
              medium: '0px 14px 10px 5px rgba(0, 0, 0, 0.2)',
              small: '0px 2px 10px 1px rgba(0, 0, 0, 0.1)',
            },
            backgroundImage: {
              'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
              'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            fill: {
              light: '#fff',
            },
            keyframes: {
              wiggle: {
                '0%, 100%': { transform: 'rotate(-3deg)' },
                '50%': { transform: 'rotate(3deg)' },
              },
              'scale-wiggle': {
                '0%, 100%': { transform: 'rotate(-3deg) scale(1.2)' },
                '50%': { transform: 'rotate(3deg) scale(1.2)' },
              },
            },
            animation: {
              'spin-slow': 'spin 2s linear infinite',
              wiggle: 'wiggle 0.8s ease-in-out infinite',
              'scale-wiggle': 'scale-wiggle 0.8s ease-in-out infinite 0.2s',
            },
          },
        },
      }}>
      <Body className='bg-[#333] font-sans p-21'>
        <Container className='bg-white rounded-medium shadow-medium p-21'>
          <div className='flex items-center justify-center p-4'>
            <a href='/'>
              <Img
                className='aspect-square rounded-full'
                src={`${'https://anpha.shop'}/images/logo.jpg`}
                width={50}
                height={50}
                alt='logo'
              />
            </a>
            <a href='/' className='text-3xl font-bold tracking-[0.3px] no-underline text-dark'>
              .AnphaShop
            </a>
          </div>

          <Section
            className='rounded-lg'
            style={{
              border: '1px solid rgb(0, 0, 0, 0.1)',
            }}>
            <Row className='p-4'>
              <Column className='font'>
                <h1 className='text-3xl font-bold text-center'>Hi</h1>
                <h2 className='text-2xl font-semibold text-center'>
                  Cảm ơn bạn đã mua hàng, chúc bạn một ngày tốt lành!
                </h2>

                <p>
                  <b>Mã đơn hàng: </b>
                  <span className='text-[#7655e6]'>{order.code}</span>
                </p>
                <p>
                  <b>Ngày đặt hàng: </b>
                  {new Intl.DateTimeFormat('vi', {
                    dateStyle: 'full',
                    timeStyle: 'medium',
                  })
                    .format(new Date(order.createdAt))
                    .replace('lúc', '')}
                </p>
                <p>
                  <b>Trạng thái: </b>
                  <span className='text-[#50C878]'>Đã giao</span>
                </p>
                <p>
                  <b>Tổng tiền: </b>
                  <b>{formatPrice(order.total)}</b>
                </p>
                <p>
                  <b>Email: </b>
                  <span className='text-[#0a82ed]'>{order.email}</span>
                </p>

                <p className='text-center'>
                  <b className='text-[24px]'>Sản phẩm</b>
                </p>

                {order.items.map((item: any) => (
                  <div
                    style={{
                      border: '1px solid rgb(0, 0, 0, 0.1)',
                    }}
                    className='border rounded-lg p-21/2 mb-4'
                    key={item._id}>
                    <Text className='font-semibold m-0 text-slate-500'>{item.product.title}</Text>

                    {item.accounts.map((account: any) => (
                      <Text
                        key={account._id}
                        className='whitespace-pre m-0 py-4 max-w-[600px] overflow-x-auto border-b '>
                        {account.info}
                      </Text>
                    ))}
                  </div>
                ))}
              </Column>
            </Row>

            <div className='flex justify-center p-4'>
              <button className='bg-primary rounded-lg text-white font-semibold cursor-pointer py-3 px-7 border-0'>
                Xem chi tiết
              </button>
            </div>
          </Section>

          <div className='flex justify-center pt-[45px]'>
            <Img
              className='max-w-full'
              width={620}
              height={200}
              src={`${'https://anpha.shop'}/images/footer-banner.jpg`}
            />
          </div>

          <p className='text-center text-xs text-slate-600'>
            © 2023 | Anpha Shop - Developed by Nguyen Anh Khoa, All rights reserved.
          </p>

          <div className='flex items-center justify-center gap-2 p-4'>
            <a href='https://zalo.me/0899320427' target='_blank' rel='noreferrer' className='wiggle-1'>
              <Img src={`${'https://anpha.shop'}/images/zalo.jpg`} width={35} height={35} alt='zalo' />
            </a>
            <a
              href='https://www.messenger.com/t/170660996137305'
              target='_blank'
              rel='noreferrer'
              className='wiggle-1'>
              <Img
                src={`${'https://anpha.shop'}/images/messenger.jpg`}
                width={35}
                height={35}
                alt='messenger'
              />
            </a>
          </div>
        </Container>
      </Body>
    </Tailwind>
  )
}

export default OrderEmail
