import { StoreCtx, useStoreState } from "./store/useStore";
import Home from "./pages/home/home";
 
export default function App() {
  const store = useStoreState();
  return (
    <StoreCtx.Provider value={store}>
      <Home />
    </StoreCtx.Provider>
  );
}
