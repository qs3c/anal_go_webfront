import { Layout } from 'antd'
import { APP_NAME } from '../../utils/constants'

const { Footer: AntFooter } = Layout

export default function Footer() {
  return (
    <AntFooter style={{ textAlign: 'center', color: '#888' }}>
      {APP_NAME} ©{new Date().getFullYear()} Created by Go Analyzer Team
    </AntFooter>
  )
}
