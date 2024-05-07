import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ImageViewer from "./components/ImageViewer";
import Navbar from "./components/Navbar";
import Uploader from "./components/Uploader";

function App() {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen flex flex-col gap-5 p-2">
                <Navbar />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Uploader />
                    <ImageViewer />
                </div>
            </div>
        </QueryClientProvider>
    );
}

export default App;
