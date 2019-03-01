export default {
  settings: {
    __typename: "Settings",
    spinner: {
      type: "loading",
      isVisible: false,
      __typename: "Spinner"
    },
    pathDefaults: {
      lastUsed: [],
      __typename: "PathDefaults"
    }
  },
  card: {
    __typename: "Card",
    position: "top",
    link: '',
    title: '',
    description: "",
    boardId: '',
    cover: '',
    listId: '',
    dueDate: '',
    dueTime: '12:00',
    labels: [],
    assignees: []
  }
}
