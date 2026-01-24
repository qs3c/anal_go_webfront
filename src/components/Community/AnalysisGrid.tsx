import { List } from 'antd'
import CommunityCard from './CommunityCard'
import type { CommunityAnalysis } from '../../types'

export default function AnalysisGrid({ items }: { items: CommunityAnalysis[] }) {
  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
      dataSource={items}
      renderItem={(item) => (
        <List.Item>
          <CommunityCard item={item} />
        </List.Item>
      )}
    />
  )
}
