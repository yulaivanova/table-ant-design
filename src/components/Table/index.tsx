import { FC, useState, useMemo } from 'react'
import reportConfig from '../../data/report-config.json'
import data from '../../data/data.json'
import {
  Table,
  TableColumnsType,
  Typography,
  Checkbox,
  Space,
  Modal
} from 'antd'
import { CheckboxValueType } from 'antd/es/checkbox/Group'
import { AlignType, DataType, TableHeadsType } from './Table'
const { Text, Title } = Typography

const tableHeads: TableHeadsType[] = reportConfig.columns.map((column) => {
  return { caption: column.caption, key: column.dataField }
})

const columnsKeys: string[] = reportConfig.columns.map(
  (column) => column.dataField
)

const ReportTable: FC = () => {
  const [reportHeads, setReportHeads] = useState<TableHeadsType[]>(tableHeads)
  const [selectedColumnsId, setSelectedColumnsId] =
    useState<CheckboxValueType[]>(columnsKeys)
  const [selectedItem, setSelectedItem] = useState<DataType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const dataSource: DataType[] = data

  const filteredColumns = useMemo(() => {
    return reportConfig.columns.filter((column) =>
      selectedColumnsId.includes(column.dataField)
    )
  }, [selectedColumnsId])

  const columns: TableColumnsType<DataType> = useMemo(() => {
    return filteredColumns.map((column) => ({
      title: () => {
        const id = reportHeads.find((item) => item.key === column.dataField)
        const index = reportHeads.findIndex(
          (item) => item.key === column.dataField
        )
        return (
          <Typography.Text
            editable={{
              onChange: (text) => {
                if (text.length <= 0) return
                const updatedReportHeads = [...reportHeads]
                updatedReportHeads[index] = {
                  ...updatedReportHeads[index],
                  caption: text
                }
                setReportHeads(updatedReportHeads)
              },
              maxLength: 30
            }}
          >
            {id && id?.caption}
          </Typography.Text>
        )
      },
      dataIndex: column.dataField,
      key: column.dataType,
      align: column.alignment as AlignType,
      onCell: () => ({
        style: { backgroundColor: column.format }
      }),
      width: `${(100 / filteredColumns.length).toFixed(2)}%`
    }))
  }, [filteredColumns, reportHeads])

  const handleCheckbox = (checkedValues: CheckboxValueType[]) => {
    if (checkedValues.length) {
      setSelectedColumnsId(checkedValues)
    }
  }

  const showModal = (item: DataType) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  return (
    <>
      <Space direction="vertical" size={20} style={{ display: 'flex' }}>
        <Title style={{ marginTop: '20px' }}>Table info</Title>
        <Checkbox.Group onChange={handleCheckbox} value={selectedColumnsId}>
          <Text>Show/Hide column</Text>
          {columnsKeys.map((column) => {
            const columnTitle = reportHeads.find((item) => item.key === column)
            return (
              <Checkbox value={column} key={column}>
                <span>{columnTitle?.caption}</span>
              </Checkbox>
            )
          })}
        </Checkbox.Group>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{
            defaultPageSize: 20,
            hideOnSinglePage: true
          }}
          onRow={(record) => ({
            onDoubleClick: () => showModal(record)
          })}
        />
      </Space>
      <Modal
        title="Person info"
        centered
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedItem && (
          <div>
            <p>
              <Text strong>ID:</Text> {selectedItem.id}
            </p>
            <p>
              <Text strong>Name:</Text> {selectedItem.name}
            </p>
            <p>
              <Text strong>Age:</Text> {selectedItem.age}
            </p>
            <p>
              <Text strong>About:</Text> {selectedItem.desc}
            </p>
          </div>
        )}
      </Modal>
    </>
  )
}

export default ReportTable
