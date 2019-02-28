import { getCurrentTab } from './utils';

let link = ""
let title = ""
const isExtension = window.location.protocol === 'chrome-extension:'

isExtension && getCurrentTab(tab => {
  if(!tab.url.icludes("chrome://")) {
    title = tab.title
    link = tab.url
  } 
})

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
    link,
    title,
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
