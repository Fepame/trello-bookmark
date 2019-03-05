export default {
  settings: {
    __typename: "Settings",
    spinner: {
      type: "loading",
      isVisible: false,
      __typename: "Spinner"
    }
  },
  card: {
    __typename: "Card",
    position: "top",
    link: '',
    title: '',
    description: '',
    boardId: '',
    teamId: null,
    cover: '',
    listId: '',
    dueDate: '',
    dueTime: '12:00',
    labels: [],
    assignees: []
  }
}
