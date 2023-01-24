import { useSelector } from 'react-redux'
import { ModelPageMode } from '../../../reducers/modelReducer'
import { RootState } from '../../../reducers/rootReducers'
import ImportDocument from './ImportDocument/ImportDocument'
import DocumentPreview from './DocumentPreview/DocumentPreview'

export default function DocumentsList() {
  const mode = useSelector((state: RootState) => state.model.mode)
  const documents = useSelector((state: RootState) => state.model.documents)

  return (
    <div>
      <ImportDocument />

      {mode != ModelPageMode.EMPTY || documents
        ? <DocumentPreview />
        : ""
      }
    </div>
  )
}