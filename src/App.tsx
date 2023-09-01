import { FC } from 'react'
import { ReportTable } from './components'
import { Col, Row } from 'antd'

const App: FC = () => {
  return (
    <Row justify="center">
      <Col span={20}>
        <ReportTable />
      </Col>
    </Row>
  )
}

export default App
