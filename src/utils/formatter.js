// capitalize the first letter
export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

// hàm giữ chỗ 1 card trong column
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true,
    // cover: null,
    memberIds: [],
    comments: [],
    attachments: []
  }
} 