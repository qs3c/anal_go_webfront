import { Layout } from 'antd'

const { Footer: AntFooter } = Layout

export default function Footer() {
  return (
    <AntFooter style={{ textAlign: 'center', color: '#888' }}>
      Go Project Analyzer ©{new Date().getFullYear()} Created by Gemini & You
    </AntFooter>
  )
}
