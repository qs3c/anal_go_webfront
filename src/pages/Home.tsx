import { Button, Card, Col, Row, Space, Typography } from 'antd'
import {
  RocketOutlined,
  EyeOutlined,
  TeamOutlined,
  ApiOutlined,
  ControlOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  HeartOutlined,
  NodeIndexOutlined,
  CloudUploadOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { CSSProperties } from 'react'

const { Title, Paragraph, Text } = Typography

const sectionStyle: CSSProperties = {
  padding: '80px 24px',
}

const containerStyle: CSSProperties = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '0 24px',
}

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          ...sectionStyle,
          paddingTop: 60,
          paddingBottom: 100,
          background: 'linear-gradient(135deg, #f0f5ff 0%, #e8ecf7 50%, #f5f0ff 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorations */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            left: -200,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'rgba(22, 119, 255, 0.06)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'rgba(114, 46, 209, 0.06)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ ...containerStyle, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 20px',
              borderRadius: 50,
              background: '#fff',
              border: '1px solid #e8e8e8',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              marginBottom: 32,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#1677ff',
                display: 'inline-block',
                animation: 'pulse 2s infinite',
              }}
            />
            <Text style={{ fontSize: 14, color: '#666' }}>
              AI 驱动的 Go 项目结构分析平台
            </Text>
          </div>

          {/* Title */}
          <Title
            level={1}
            style={{
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 16,
              color: '#1a1a2e',
            }}
          >
            Go 项目结构分析
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #1677ff, #722ed1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              从未如此简单
            </span>
          </Title>

          {/* Subtitle */}
          <Paragraph
            style={{
              fontSize: 18,
              color: '#666',
              maxWidth: 640,
              margin: '0 auto 40px',
              lineHeight: 1.8,
            }}
          >
            上传你的 Go 项目源码，AI 自动分析结构体依赖关系，生成可视化架构图。
            <br />
            从代码理解到架构设计，全方位提升你的开发效率。
          </Paragraph>

          {/* CTA Buttons */}
          <Space size={16} style={{ marginBottom: 60 }}>
            <Link to="/workspace">
              <Button
                type="primary"
                size="large"
                icon={<RocketOutlined />}
                style={{
                  height: 52,
                  padding: '0 32px',
                  fontSize: 16,
                  borderRadius: 50,
                  background: 'linear-gradient(135deg, #1677ff, #4f46e5)',
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(22, 119, 255, 0.3)',
                }}
              >
                立即开始分析
              </Button>
            </Link>
            <Link to="/community">
              <Button
                size="large"
                icon={<EyeOutlined />}
                style={{
                  height: 52,
                  padding: '0 32px',
                  fontSize: 16,
                  borderRadius: 50,
                  border: '1px solid #d9d9d9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                浏览社区作品
              </Button>
            </Link>
          </Space>

          {/* Stats */}
          <div
            style={{
              maxWidth: 800,
              margin: '0 auto',
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(12px)',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              padding: '32px 40px',
            }}
          >
            <Row gutter={32}>
              {[
                { icon: <NodeIndexOutlined style={{ color: '#1677ff' }} />, value: 'AI', label: '智能分析' },
                { icon: <ApiOutlined style={{ color: '#722ed1' }} />, value: '6+', label: '支持模型' },
                { icon: <ControlOutlined style={{ color: '#52c41a' }} />, value: '10', label: '最大深度' },
                { icon: <TeamOutlined style={{ color: '#fa8c16' }} />, value: 'Free', label: '免费使用' },
              ].map((item, i) => (
                <Col span={6} key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e' }}>{item.value}</div>
                  <div style={{ fontSize: 14, color: '#888', marginTop: 4 }}>{item.label}</div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ ...sectionStyle, background: '#fff' }}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Title level={2} style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
              全方位的项目分析方案
            </Title>
            <Paragraph style={{ fontSize: 16, color: '#888' }}>
              无论你是想理解项目架构还是梳理依赖关系，这里都有适合你的工具
            </Paragraph>
          </div>

          <Row gutter={24}>
            {/* Card 1: AI Analysis */}
            <Col span={8}>
              <Card
                hoverable
                style={{
                  borderRadius: 24,
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  height: '100%',
                  overflow: 'hidden',
                }}
                styles={{ body: { padding: 32 } }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: '#e6f4ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                  }}
                >
                  <CloudUploadOutlined style={{ fontSize: 28, color: '#1677ff' }} />
                </div>
                <Title level={3} style={{ fontSize: 22, marginBottom: 12 }}>
                  AI 智能分析
                </Title>
                <Paragraph style={{ color: '#666', lineHeight: 1.8, marginBottom: 24 }}>
                  上传 Go 项目 ZIP 包，选择入口结构体和分析深度，AI 自动解析结构体之间的依赖关系，生成完整的调用链路图。
                </Paragraph>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {['一键上传分析', '多种 AI 模型可选', '自定义分析深度'].map((text) => (
                    <li
                      key={text}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: '#555',
                        marginBottom: 12,
                      }}
                    >
                      <span style={{ color: '#1677ff', fontWeight: 700 }}>&#10003;</span>
                      {text}
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>

            {/* Card 2: Visual Diagram - featured */}
            <Col span={8}>
              <Card
                hoverable
                style={{
                  borderRadius: 24,
                  background: 'linear-gradient(180deg, #1a1a2e, #16213e)',
                  border: 'none',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  height: '100%',
                  overflow: 'hidden',
                }}
                styles={{ body: { padding: 32 } }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                  }}
                >
                  <NodeIndexOutlined style={{ fontSize: 28, color: '#fff' }} />
                </div>
                <Title level={3} style={{ fontSize: 22, marginBottom: 12, color: '#fff' }}>
                  可视化架构图
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 24 }}>
                  基于 Excalidraw 打造的交互式架构图编辑器，支持拖拽、缩放、连线编辑，直观展示结构体之间的依赖关系。
                </Paragraph>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {['交互式图表编辑', '自动布局排版', '支持导出分享'].map((text) => (
                    <li
                      key={text}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: 'rgba(255,255,255,0.85)',
                        marginBottom: 12,
                      }}
                    >
                      <span style={{ color: '#818cf8', fontWeight: 700 }}>&#10003;</span>
                      {text}
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>

            {/* Card 3: Community */}
            <Col span={8}>
              <Card
                hoverable
                style={{
                  borderRadius: 24,
                  border: '1px solid #f0f0f0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  height: '100%',
                  overflow: 'hidden',
                }}
                styles={{ body: { padding: 32 } }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: '#f9f0ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                  }}
                >
                  <ShareAltOutlined style={{ fontSize: 28, color: '#722ed1' }} />
                </div>
                <Title level={3} style={{ fontSize: 22, marginBottom: 12 }}>
                  社区互动分享
                </Title>
                <Paragraph style={{ color: '#666', lineHeight: 1.8, marginBottom: 24 }}>
                  将你的分析结果一键分享至社区广场，浏览其他开发者的项目架构，互相学习优秀的设计模式。
                </Paragraph>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {['一键公开分享', '点赞收藏评论', '发现优秀架构'].map((text) => (
                    <li
                      key={text}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: '#555',
                        marginBottom: 12,
                      }}
                    >
                      <span style={{ color: '#722ed1', fontWeight: 700 }}>&#10003;</span>
                      {text}
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ ...sectionStyle, background: '#f7f8fa' }}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Title level={2} style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
              为什么选择 Go Analyzer？
            </Title>
          </div>

          <Row gutter={[24, 24]}>
            {[
              {
                icon: <ApiOutlined />,
                color: '#1677ff',
                bg: '#e6f4ff',
                title: '多模型支持',
                desc: '支持 GPT-4、Claude、GLM 等多种 AI 模型，按需选择',
              },
              {
                icon: <ControlOutlined />,
                color: '#722ed1',
                bg: '#f9f0ff',
                title: '深度可控',
                desc: '自由设置 1-10 级分析深度，兼顾精度与性能',
              },
              {
                icon: <ThunderboltOutlined />,
                color: '#fa8c16',
                bg: '#fff7e6',
                title: '实时进度',
                desc: 'WebSocket 实时推送分析进度，随时掌握任务状态',
              },
              {
                icon: <RocketOutlined />,
                color: '#52c41a',
                bg: '#f6ffed',
                title: '高效准确',
                desc: 'AI 驱动的智能解析，精准识别结构体依赖关系',
              },
              {
                icon: <HeartOutlined />,
                color: '#eb2f96',
                bg: '#fff0f6',
                title: '社区互动',
                desc: '点赞、收藏、评论，与其他开发者交流架构心得',
              },
              {
                icon: <SafetyOutlined />,
                color: '#13c2c2',
                bg: '#e6fffb',
                title: '安全可靠',
                desc: '分析结果默认私有，按需公开分享，数据安全有保障',
              },
            ].map((item, i) => (
              <Col span={8} key={i}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 16,
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    height: '100%',
                  }}
                  styles={{ body: { padding: 24 } }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: item.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      color: item.color,
                      marginBottom: 16,
                    }}
                  >
                    {item.icon}
                  </div>
                  <Title level={4} style={{ fontSize: 18, marginBottom: 8 }}>
                    {item.title}
                  </Title>
                  <Paragraph style={{ color: '#888', margin: 0, fontSize: 14, lineHeight: 1.6 }}>
                    {item.desc}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ ...sectionStyle, background: '#fff' }}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Title level={2} style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
              三步完成分析
            </Title>
            <Paragraph style={{ fontSize: 16, color: '#888' }}>
              简单三步，快速生成项目架构图
            </Paragraph>
          </div>

          <Row gutter={48} align="middle">
            {[
              {
                step: '01',
                title: '上传项目',
                desc: '将 Go 项目打包为 ZIP 文件上传，系统自动解析项目结构与结构体列表',
                color: '#1677ff',
              },
              {
                step: '02',
                title: '配置参数',
                desc: '选择入口结构体、分析深度和 AI 模型，点击开始分析',
                color: '#722ed1',
              },
              {
                step: '03',
                title: '查看结果',
                desc: 'AI 分析完成后，在可视化编辑器中查看、编辑和分享架构图',
                color: '#52c41a',
              },
            ].map((item, i) => (
              <Col span={8} key={i} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${item.color}15, ${item.color}25)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    border: `2px solid ${item.color}30`,
                  }}
                >
                  <span style={{ fontSize: 28, fontWeight: 800, color: item.color }}>
                    {item.step}
                  </span>
                </div>
                <Title level={4} style={{ fontSize: 20, marginBottom: 8 }}>
                  {item.title}
                </Title>
                <Paragraph style={{ color: '#888', fontSize: 14, lineHeight: 1.8, maxWidth: 280, margin: '0 auto' }}>
                  {item.desc}
                </Paragraph>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ ...sectionStyle, paddingTop: 60, paddingBottom: 80, background: '#fff' }}>
        <div style={containerStyle}>
          <div
            style={{
              background: 'linear-gradient(135deg, #1677ff, #4f46e5)',
              borderRadius: 24,
              padding: '64px 48px',
              textAlign: 'center',
              boxShadow: '0 16px 48px rgba(22, 119, 255, 0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Title level={2} style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
                准备好分析你的 Go 项目了吗？
              </Title>
              <Paragraph style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 32, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
                立即注册，免费体验 AI 驱动的结构体依赖分析，让架构设计一目了然。
              </Paragraph>
              <Link to="/register">
                <Button
                  size="large"
                  style={{
                    height: 52,
                    padding: '0 40px',
                    fontSize: 16,
                    borderRadius: 50,
                    background: '#fff',
                    color: '#1677ff',
                    border: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  }}
                >
                  免费开始使用
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
