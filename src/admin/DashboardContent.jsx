import React from "react";
import { Card, CardContent } from "../components/ui/Card.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


export default function DashboardContent() {
    const data = [
      { name: 'Jan', sales: 400 },
      { name: 'Feb', sales: 300 },
      { name: 'Mar', sales: 500 },
      { name: 'Apr', sales: 200 },
    ];

    return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold">Ringkasan</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-gray-800 text-white">
          <CardContent className="p-4">
            <h3 className="text-lg">Total Produk</h3>
            <p className="text-2xl font-bold">120</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white">
          <CardContent className="p-4">
            <h3 className="text-lg">Total Pesanan</h3>
            <p className="text-2xl font-bold">340</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 text-white">
          <CardContent className="p-4">
            <h3 className="text-lg">Total Pengguna</h3>
            <p className="text-2xl font-bold">78</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg mb-4">Statistik Penjualan</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="sales" fill="#38bdf8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
