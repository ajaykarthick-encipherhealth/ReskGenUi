import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Skeleton, Grid, Table } from 'antd';

const { Title, Paragraph, Text } = Typography;

const columns = [
  { title: 'Header 1', dataIndex: 'header1', key: 'header1' },
  { title: 'Header 2', dataIndex: 'header2', key: 'header2' },
  { title: 'Header 3', dataIndex: 'header3', key: 'header3' },
];

const data = [
  { key: '1', header1: 'Row 1 Cell 1', header2: 'Row 1 Cell 2', header3: 'Row 1 Cell 3' },
  { key: '2', header1: 'Row 2 Cell 1', header2: 'Row 2 Cell 2', header3: 'Row 2 Cell 3' },
  { key: '3', header1: 'Row 3 Cell 1', header2: 'Row 3 Cell 2', header3: 'Row 3 Cell 3' },
  { key: '4', header1: 'Row 4 Cell 1', header2: 'Row 4 Cell 2', header3: 'Row 4 Cell 3' },
  { key: '5', header1: 'Row 5 Cell 1', header2: 'Row 5 Cell 2', header3: 'Row 5 Cell 3' },
];

const variants = [
  { variant: 'h1', text: 'h1' },
  { variant: 'h3', text: 'h3' },
  { variant: 'body1', text: 'body1' },
  { variant: 'caption', text: 'caption' },
];

function TypographyDemo({ loading }) {
  return (
    <div>
      {variants.map(({ variant, text }) => (
        <div key={variant}>
          {loading ? <Skeleton active paragraph={{ rows: 1 }} /> : <Text strong>{text}</Text>}
        </div>
      ))}
    </div>
  );
}

TypographyDemo.propTypes = {
  loading: PropTypes.bool,
};

function TableSkeleton({ loading }) {
  return (
    <Skeleton active loading={loading}>
      <Table columns={columns} dataSource={loading ? [] : data} pagination={false} />
    </Skeleton>
  );
}

TableSkeleton.propTypes = {
  loading: PropTypes.bool,
};

export default function SkeletonTypography() {
  return (
    <Grid container spacing={8}>
      <Grid item xs={12}>
        <TypographyDemo loading />
      </Grid>
      <Grid item xs={12}>
        <TypographyDemo />
      </Grid>
      <Grid item xs={12}>
        <TableSkeleton loading />
      </Grid>
      <Grid item xs={12}>
        <TableSkeleton />
      </Grid>
    </Grid>
  );
}
