import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase, { getData } from '../data/data';

type TableData = Array<{
  id: number;
  nama?: string;
  dusun?: string;
  desa?: string;
  kecamatan?: string;
  jenis?: string;
  status?: string;
  potensi?: string;
  x?: string;
  y?: string;
  surveyor?: string;
  referensi?: string;
}>;

function DataTable() {
  const [tableData, setTableData] = useState([] as TableData);
  useEffect(() => {
    const session = supabase.auth.session();
    if (!session) {
      return;
    }

    getData().then((data: TableData) => {
      setTableData(data);
    });
  });

  return (
    <div>
      <h1>Basis Data</h1>
      {tableData.length
        ? <Table data={tableData} />
        : <p><Link to="/masuk">Masuk</Link> untuk menyunting data.</p>}
    </div>
  );
}

interface TableProps {
  data: TableData;
}

function Table(props: TableProps) {
  const { data } = props;
  return (
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>nama</th>
          <th>dusun</th>
          <th>desa</th>
          <th>kecamatan</th>
          <th>jenis</th>
          <th>status</th>
          <th>potensi</th>
          <th>x</th>
          <th>y</th>
          <th>surveyor</th>
          <th>referensi</th>
        </tr>
      </thead>
      <tbody>
        {
          data.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.nama}</td>
              <td>{row.dusun}</td>
              <td>{row.desa}</td>
              <td>{row.kecamatan}</td>
              <td>{row.jenis}</td>
              <td>{row.status}</td>
              <td>{row.potensi}</td>
              <td>{row.x}</td>
              <td>{row.y}</td>
              <td>{row.surveyor}</td>
              <td>{row.referensi}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

export default DataTable;
