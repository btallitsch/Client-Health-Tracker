import { useClientStore } from './store/useClientStore';
import { Dashboard } from './components/Dashboard';
import { ClientForm } from './components/ClientForm';
import { ClientDetailModal } from './components/ClientDetailModal';

export default function App() {
  const { modalMode } = useClientStore();

  return (
    <>
      <Dashboard />
      {(modalMode === 'add' || modalMode === 'edit') && <ClientForm />}
      {modalMode === 'view' && <ClientDetailModal />}
    </>
  );
}
