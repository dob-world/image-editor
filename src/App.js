import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import IndexComponent from './components'
import 'bootstrap/dist/css/bootstrap.min.css'
import { RecoilRoot } from 'recoil'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
            suspense: true,
        },
    },
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RecoilRoot>
                <IndexComponent />
            </RecoilRoot>
        </QueryClientProvider>
    )
}

export default App
