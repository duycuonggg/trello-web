// tạo cấu trúc "rfce"
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

// drag drop libarary
import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // yêu cầu di chuyển chuột 10px thì mới kích hoạt event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { dalay: 250, tolerance: 500 } })

  // const sensors = useSensors(pointerSensor)
  // ưu tiên kết hợp 2 loại sensor mouse và touch để trải nghiệm trên mobie tốt nhất và không bị bug
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  const [activeDragItemId, setActiveDragItemId] = useState([null])
  const [activeDragItemType, setActiveDragItemType] = useState([null])
  const [activeDragItemData, setActiveDragItemData] = useState([null])
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState([null])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // tìm 1 cái column theo cardId
  const findColumnByCardId = (cardId) => {
    /*
    đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDragOver chúng ta sẽ làm lại dữ liệu cho Cards\
    hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới
    */
    return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  // function chung xử lý việc cập nhật lại state trong trường hợp di chuyển card giữa các column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      // tìm vị trí (index) của cái overCard trong column đích (nơi mà activeCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      // logic tính toán cardIndex mới 
      let newCardIndex
      const isBeLowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBeLowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // clone mảng OrderedColumnState cũ ra 1 cái mới để xử lí data rồi return - cập nhật lại OrderedColumnState mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      if (nextActiveColumn) {
        // xóa card ở cái column active
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      if (nextOverColumn) {
        // kiểm tra xem card đang kéo nó có tồn tại column chưa , nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        //  phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        // tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // cập nhật lại mảng cardOrderIds cho nguồn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)

      }

      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    // console.log ('handleDragEnd: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // nếu là hành động kéo card thì mới thực hiện những hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // trigger (kích hoạt) trong quá trình drag (kéo) 1 phần tử
  const handleDragOver = (event) => {
    // không làm gì thêm nếu đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // console.log('handleDragEnd: ', event)
    //  còn nếu kéo card thì xử lí thêm để có thể kéo card qua lại giữa các columns
    const { active, over } = event

    // kiểm tra nếu không tồn tại over (kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    if (!active || !over) return

    // activeDraggingCard: là cái card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard: là cái card đang tương tác trên hoặc dưới so với cái card đang được kéo ở trên
    const { id: overCardId } = over

    // tìm 2 cái column của cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
    if (!activeColumn || !overColumn) return

    /*
    xử lí logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card qua chính column ban đầu của nó thì không làm gì
    vì đây đang là đoạn xử lí lúc kéo (handleDragOver), còn xử lí lúc kéo xong xuôi thì nó lại ở vấn đề khác ở (handleDragEnd)
    */
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event)
    const { active, over } = event

    // kiểm tra nếu không tồn tại over (kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    if (!over) return

    // xử lý kéo thả cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard: là cái card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCard: là cái card đang tương tác trên hoặc dưới so với cái card đang được kéo ở trên
      const { id: overCardId } = over

      // tìm 2 cái column của cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
      if (!activeColumn || !overColumn) return

      /*
      hành động kéo thả giữa 2 column khác nhau
      phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id chứ không phải activeData trong scope handleDragEnd
      này vì sau khi đi qua onDragOver tới đây là state của card đã bị cập nhật 1 lần
      */
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // hành động kéo thả trong cùng 1 column

        // lấy vị trí cũ oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // lấy vị trí mới
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        // dùng arrayMove vì kéo card trong 1 cái column thì tương tự với logic kéo column trong 1 cái board content
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns(prevColumns => {
          // clone mảng OrderedColumnState cũ ra 1 cái mới để xử lí data rồi return - cập nhật lại OrderedColumnState mới
          const nextColumns = cloneDeep(prevColumns)

          // tìm tới cái column đang thả
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)

          // cập nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

          // trả về giá trị mới chuẩn vị trí
          return nextColumns
        })
      }
    }

    // xử lý kéo thả columns
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      console.log('hành động kéo thả column - tạm thời không làm gì')
      // nếu vị trí sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        // lấy vị trí cũ
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // lấy vị trí mới
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        // xử lí gọi API
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // console.log('dndOrderedColumns: ', dndOrderedColumns)
        // console.log('dndOrderedColumnsIds: ', dndOrderedColumnsIds)

        // cập nhật lại state ban đầu sau khi đã kéo thả
        setOrderedColumns(dndOrderedColumns)
      }
    }

    // những giá trị này sau khi kéo thả luôn phải đưa về giá trị null mặc định ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  // animation khi drop phần tử
  const customDropAnimation = { sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }
  return (
    <DndContext
      // cảm biến
      sensors={sensors}
      // thuật toán phát hiện va chạm
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {(!activeDragItemType && null)}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent