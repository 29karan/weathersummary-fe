'use client';

import { useMemo, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Paper, Text, Badge } from '@mantine/core';
import type { TableRow } from '@/lib/dataFilters';
import { getTemperatureColor, getRainfallColor } from '@/lib/dataFilters';

interface WeatherDataTableProps {
  data: TableRow[];
}

export function WeatherDataTable({ data }: WeatherDataTableProps) {
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(25);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'year',
    direction: 'desc',
  });

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const accessor = sortStatus.columnAccessor as keyof TableRow;
      const aValue = a[accessor];
      const bValue = b[accessor];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortStatus.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortStatus.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [data, sortStatus]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * recordsPerPage;
    return sortedData.slice(start, start + recordsPerPage);
  }, [sortedData, page, recordsPerPage]);

  return (
    <Paper shadow="sm" radius="md" withBorder>
      <DataTable
        records={paginatedData}
        columns={[
          {
            accessor: 'year',
            title: 'Year',
            sortable: true,
            width: 80,
          },
          {
            accessor: 'regionName',
            title: 'Region',
            sortable: true,
            width: 200,
          },
          {
            accessor: 'temperatureMean',
            title: 'Temp (Mean)',
            sortable: true,
            width: 120,
            render: (row) => (
              <Badge
                color={getTemperatureColor(row.temperatureMean)}
                variant="light"
                size="sm"
              >
                {row.temperatureMean}°C
              </Badge>
            ),
          },
          {
            accessor: 'temperatureMin',
            title: 'Temp (Min)',
            sortable: true,
            width: 110,
            render: (row) => (
              <Text size="sm" c="blue">
                {row.temperatureMin}°C
              </Text>
            ),
          },
          {
            accessor: 'temperatureMax',
            title: 'Temp (Max)',
            sortable: true,
            width: 110,
            render: (row) => (
              <Text size="sm" c="red">
                {row.temperatureMax}°C
              </Text>
            ),
          },
          {
            accessor: 'rainfall',
            title: 'Rainfall',
            sortable: true,
            width: 100,
            render: (row) => (
              <Badge
                style={{ backgroundColor: getRainfallColor(row.rainfall) }}
                variant="filled"
                size="sm"
              >
                {row.rainfall}mm
              </Badge>
            ),
          },
          {
            accessor: 'rainDays',
            title: 'Rain Days',
            sortable: true,
            width: 100,
            render: (row) => <Text size="sm">{row.rainDays}</Text>,
          },
          {
            accessor: 'sunshine',
            title: 'Sunshine',
            sortable: true,
            width: 100,
            render: (row) => (
              <Text size="sm" c="yellow">
                {row.sunshine}hrs
              </Text>
            ),
          },
          {
            accessor: 'frostDays',
            title: 'Frost Days',
            sortable: true,
            width: 100,
            render: (row) => (
              <Text size="sm" c="cyan">
                {row.frostDays}
              </Text>
            ),
          },
        ]}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        totalRecords={sortedData.length}
        recordsPerPage={recordsPerPage}
        page={page}
        onPageChange={setPage}
        recordsPerPageOptions={[25, 50, 100]}
        onRecordsPerPageChange={setRecordsPerPage}
        highlightOnHover
        striped
        verticalSpacing="sm"
        minHeight={400}
        noRecordsText="No records found"
      />
    </Paper>
  );
}
