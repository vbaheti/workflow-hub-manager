
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PricingHistory as PricingHistoryType } from '../../types/pricing';

interface PricingHistoryProps {
  history: PricingHistoryType[];
}

export default function PricingHistory({ history }: PricingHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
        <CardDescription>Audit trail of all pricing changes</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Rule ID</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Changes</TableHead>
              <TableHead>User</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                <TableCell className="font-mono">{entry.ruleId}</TableCell>
                <TableCell>
                  <Badge variant={
                    entry.action === 'created' ? 'default' :
                    entry.action === 'updated' ? 'secondary' : 'destructive'
                  }>
                    {entry.action}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="text-xs text-muted-foreground">
                    {JSON.stringify(entry.changes, null, 2)}
                  </div>
                </TableCell>
                <TableCell>{entry.userName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
