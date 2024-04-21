'use client'
import OrderEmail from '@/components/emails/OrderEmail'
import { render } from '@react-email/render'

export const order = {
  _id: '66236a39faf0d2df956fc1be',
  code: '0D317',
  email: 'oehaao@mailto.plus',
  total: 131000,
  discount: 0,
  items: [
    {
      _id: '66236a2c0305407424d7119e',
      product: {
        _id: '6616c512cfdc10598ab611c4',
        title: 'Birds V',
        oldPrice: 269000,
        price: 49000,
        description:
          'Duis sodales pretium ligula, id posuere libero mattis in. Nulla porta diam lorem, eget placerat orci egestas nec. Vivamus sed pulvinar risus, tristique luctus velit. Quisque ac diam lacinia, scelerisque augue sit amet, accumsan urna. Nunc augue leo, volutpat ac velit non, tincidunt ultrices leo. Donec vestibulum, quam quis aliquam accumsan, lacus felis dictum mauris, at lacinia ante sapien sodales magna. Donec tellus arcu, scelerisque vitae placerat ut, condimentum at tellus. Morbi eget augue tincidunt, dictum purus vel, rhoncus sapien. Pellentesque ligula metus, consectetur nec ex at, ultricies ornare purus. Duis suscipit pellentesque ligula vel ultricies.\r\n\r\nCurabitur id tellus eu risus ornare vestibulum nec nec ligula. Ut vitae arcu elementum, pellentesque mauris vel, semper turpis. Aliquam erat volutpat. Donec rhoncus enim et ligula pulvinar, sed aliquam felis ullamcorper. Cras porta est at quam tincidunt, in dictum enim accumsan. Nam ligula est, efficitur tempus mi ac, commodo volutpat purus. Aliquam sollicitudin lectus et varius iaculis. Nunc quis rhoncus dui. Cras metus odio, varius luctus ligula pretium, congue vestibulum ex. Suspendisse tristique, ipsum a tristique tincidunt, purus nibh accumsan sapien, et consectetur mi nulla id mauris. Nulla tempus augue id odio luctus volutpat. Phasellus vitae scelerisque turpis, vel molestie massa. Nullam ut dui porttitor, aliquam purus a, semper nisl. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Suspendisse sapien elit, ullamcorper vehicula lacus in, aliquet dictum est.\r\n\r\nVestibulum et purus et ipsum rhoncus hendrerit. Integer blandit tortor eget neque lobortis, eget porttitor lacus accumsan. Vivamus turpis erat, luctus ac volutpat vitae, molestie fermentum risus. Fusce ut libero sit amet felis hendrerit bibendum ut nec nunc. Curabitur sit amet ultrices dui. Sed vitae est ut eros egestas efficitur at faucibus risus. Donec dictum blandit libero id ornare. Suspendisse sed pharetra massa. Nullam malesuada sollicitudin orci dapibus laoreet. Maecenas varius, dolor sit amet tincidunt consequat, augue ante congue ex, sed pellentesque purus justo a est. Vivamus dictum congue tincidunt. Nunc pulvinar hendrerit ullamcorper.',
        tags: [
          {
            _id: '6616ac1e54b0315cbef1f78c',
            title: 'G',
            isFeatured: false,
            productQuantity: 1,
            createdAt: '2024-04-10T15:11:26.012Z',
            updatedAt: '2024-04-10T17:18:17.555Z',
            slug: 'g',
            __v: 0,
          },
          {
            _id: '6616aba42e1e6bc892dfd56f',
            title: 'B',
            isFeatured: false,
            productQuantity: 2,
            createdAt: '2024-04-10T15:09:24.134Z',
            updatedAt: '2024-04-10T16:57:54.961Z',
            slug: 'b',
            __v: 0,
          },
          {
            _id: '6616ac2754b0315cbef1f790',
            title: 'I',
            isFeatured: false,
            productQuantity: 2,
            createdAt: '2024-04-10T15:11:35.740Z',
            updatedAt: '2024-04-10T16:57:54.961Z',
            slug: 'i',
            __v: 0,
          },
        ],
        category: {
          _id: '6616c227763bef201baf5bed',
          title: '99',
          productQuantity: 2,
          createdAt: '2024-04-10T16:45:27.727Z',
          updatedAt: '2024-04-10T17:18:41.783Z',
          slug: '99',
          __v: 0,
        },
        images: [
          'https://anphashop.s3.ap-southeast-1.amazonaws.com/test-b4b426198cf8cc1dd1842aca8230457368d2de69d2446414fef26480b49b4df9',
          'https://anphashop.s3.ap-southeast-1.amazonaws.com/test-4528f4f4e73ba571fc079632a7fd5341a3999ee2918a7481a2284bb5f0c71dc4',
        ],
        sold: 2,
        stock: 54,
        active: true,
        createdAt: '2024-04-10T16:57:54.162Z',
        updatedAt: '2024-04-19T17:53:48.792Z',
        slug: 'birds-v',
        __v: 0,
        flashsale: null,
      },
      quantity: 1,
      accounts: [
        {
          _id: '6622afaa13c9a6df523bacba',
          type: '6616c512cfdc10598ab611c4',
          info: '✅Email: anphashop79@gmail.com\n✅Password: 797914\n✅Slot: A1\n✅Pin: 1179\n\n- ⚠️ Lưu ý: Tên profile sẽ do người bán đặt để tiện quản lí, nếu bạn đổi tên profile, tài khoản của bạn sẽ bị thu hồi ❌\n\n- 💀 Lưu ý: Đề phòng trường hợp những shop "lừa đảo" khác giả vờ mua hàng sau đó bán lại. Tài khoản của bạn sẽ được đổi pass từ 6 - 15 ngày 1 lần, và pass mới sẽ được gửi qua mail cho bạn. Hãy kiểm tra mail khi không thể đăng nhập. Xin chân thành cảm ơn🫡',
          active: false,
          renew: '2024-06-20',
          times: {
            days: 100,
            hours: 0,
            minutes: 0,
            seconds: 0,
          },
          createdAt: '2024-04-19T17:53:46.491Z',
          updatedAt: '2024-04-19T17:53:46.491Z',
          __v: 0,
        },
      ],
    },
    {
      _id: '66236a2a0305407424d7119d',
      product: {
        _id: '6616c4a9cfdc10598ab611bb',
        title: 'AK2',
        oldPrice: 500000,
        price: 82000,
        description:
          'Donec vestibulum, quam quis aliquam accumsan, lacus felis dictum mauris, at lacinia ante sapien sodales magna. Donec tellus arcu, scelerisque vitae placerat ut, condimentum at tellus. Morbi eget augue tincidunt, dictum purus vel, rhoncus sapien. Pellentesque ligula metus, consectetur nec ex at, ultricies ornare purus. Duis suscipit pellentesque ligula vel ultricies.',
        tags: [
          {
            _id: '6616ac2a29ca284b69643341',
            title: 'J',
            isFeatured: true,
            productQuantity: 1,
            createdAt: '2024-04-10T15:11:38.726Z',
            updatedAt: '2024-04-15T18:29:24.412Z',
            slug: 'j',
            __v: 0,
          },
          {
            _id: '6616ac1a54b0315cbef1f78a',
            title: 'F',
            isFeatured: true,
            productQuantity: 1,
            createdAt: '2024-04-10T15:11:22.987Z',
            updatedAt: '2024-04-15T18:29:24.412Z',
            slug: 'f',
            __v: 0,
          },
          {
            _id: '6616ac1554b0315cbef1f788',
            title: 'E',
            isFeatured: false,
            productQuantity: 1,
            createdAt: '2024-04-10T15:11:17.374Z',
            updatedAt: '2024-04-10T17:18:31.787Z',
            slug: 'e',
            __v: 0,
          },
        ],
        category: {
          _id: '6616c227763bef201baf5bed',
          title: '99',
          productQuantity: 2,
          createdAt: '2024-04-10T16:45:27.727Z',
          updatedAt: '2024-04-10T17:18:41.783Z',
          slug: '99',
          __v: 0,
        },
        images: [
          'https://anphashop.s3.ap-southeast-1.amazonaws.com/test-c63b25b1ece8ce927dd07ae96542b216c2404ca6f86df8ecde1ab3a64fdcbd4a',
        ],
        sold: 5,
        stock: 16,
        active: true,
        createdAt: '2024-04-10T16:56:09.813Z',
        updatedAt: '2024-04-19T17:53:41.829Z',
        slug: 'ak2',
        __v: 0,
        flashsale: null,
      },
      quantity: 1,
      accounts: [
        {
          _id: '6622afa213c9a6df523bac88',
          type: '6616c4a9cfdc10598ab611bb',
          info: '        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum quibusdam voluptate beatae aut in quia, illo accusantium fugiat eligendi nostrum aspernatur debitis suscipit ad quas ipsam nobis aliquid magni saepe similique quasi velit quo? Dignissimos molestias amet minus nesciunt id corrupti, dolorem ducimus quod nisi alias, accusantium, at nemo doloribus?',
          active: false,
          renew: '2024-06-20',
          times: {
            days: 100,
            hours: 0,
            minutes: 0,
            seconds: 0,
          },
          createdAt: '2024-04-19T17:53:38.420Z',
          updatedAt: '2024-04-19T17:53:38.420Z',
          __v: 0,
        },
      ],
    },
  ],
  status: 'done',
  paymentMethod: 'banking',
  createdAt: '2024-04-20T07:09:45.271Z',
  updatedAt: '2024-04-21T08:44:34.909Z',
  __v: 0,
}

function OrderEmailPage() {
  const html = render(<OrderEmail order={order} />, {
    pretty: true,
  })

  console.log(html)

  return <OrderEmail order={order} />
}

export default OrderEmailPage
