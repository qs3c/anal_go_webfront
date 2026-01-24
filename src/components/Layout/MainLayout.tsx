import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const { Content } = Layout

export default function MainLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ padding: '24px 50px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  )
}
