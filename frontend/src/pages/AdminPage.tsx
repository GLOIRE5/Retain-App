import { useState } from 'react';
import { Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import AdminCategoriesPanel from '../components/AdminCategoriesPanel';
import AdminOverview from '../components/AdminOverview';

type AdminTab = 'overview' | 'categories';

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('overview');

  return (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Admin dashboard
      </Typography>

      <Paper>
        <Tabs value={tab} onChange={(_event, value: AdminTab) => setTab(value)}>
          <Tab label="Overview" value="overview" />
          <Tab label="Categories" value="categories" />
        </Tabs>
      </Paper>

      {/* Each tab loads fresh data when opened, so category changes show up in the overview */}
      {tab === 'overview' ? <AdminOverview /> : <AdminCategoriesPanel />}
    </Stack>
  );
}
