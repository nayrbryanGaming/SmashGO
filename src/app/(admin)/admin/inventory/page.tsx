'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Package, ShoppingCart, RefreshCw, AlertTriangle, MoreVertical } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function AdminInventoryPage() {
  const supabase = createClient()
  const [inventory, setInventory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInventory() {
      const { data } = await supabase
        .from('inventory')
        .select('*')
        .order('name', { ascending: true })
      
      if (data) setInventory(data)
      setLoading(false)
    }

    fetchInventory()
  }, [])

  const updateStock = async (id: string, newStock: number) => {
    const { error } = await supabase
      .from('inventory')
      .update({ stock_quantity: newStock })
      .eq('id', id)

    if (!error) {
      setInventory(prev => prev.map(item => item.id === id ? { ...item, stock_quantity: newStock } : item))
      toast({ title: 'Stok diperbarui', description: 'Jumlah stok berhasil disimpan.' })
    }
  }

  return (
    <div className="container py-10 space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-foreground">Inventaris & Stok</h1>
          <p className="text-muted-foreground font-medium">Kelola peralatan yang disewakan dan barang yang dijual.</p>
        </div>
        <Button className="gap-2 font-bold shadow-lg shadow-primary/20">
          <Plus className="h-5 w-5" /> Tambah Barang
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-blue-50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600"><Package /></div>
            <div>
              <p className="text-2xl font-black">{inventory.length}</p>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-tight">Total Item</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-orange-50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm text-orange-600"><AlertTriangle /></div>
            <div>
              <p className="text-2xl font-black">{inventory.filter(i => i.stock_quantity <= i.min_stock_alert).length}</p>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-tight">Stok Menipis</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-green-50">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-4 bg-white rounded-2xl shadow-sm text-green-600"><ShoppingCart /></div>
            <div>
              <p className="text-2xl font-black">Rp {(inventory.length * 12500).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-tight">Estimasi Nilai Stok</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold text-xs uppercase text-muted-foreground px-6 py-4">Nama Barang</TableHead>
              <TableHead className="font-bold text-xs uppercase text-muted-foreground p-4">Kategori</TableHead>
              <TableHead className="font-bold text-xs uppercase text-muted-foreground p-4 text-center">Stok</TableHead>
              <TableHead className="font-bold text-xs uppercase text-muted-foreground p-4">Harga Unit</TableHead>
              <TableHead className="font-bold text-xs uppercase text-muted-foreground p-4">Status</TableHead>
              <TableHead className="p-4 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-20 text-muted-foreground">Memuat data inventaris...</TableCell></TableRow>
            ) : inventory.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-20 text-muted-foreground">Tidak ada barang dalam inventaris.</TableCell></TableRow>
            ) : (
              inventory.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30">
                  <TableCell className="px-6 py-4 font-bold text-foreground text-base">{item.name}</TableCell>
                  <TableCell className="p-4">
                    <Badge variant="outline" className="capitalize border-muted-foreground/20 text-muted-foreground">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="p-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg" onClick={() => updateStock(item.id, item.stock_quantity - 1)}>-</Button>
                      <span className={`font-black text-lg w-8 ${item.stock_quantity <= item.min_stock_alert ? 'text-red-600' : 'text-foreground'}`}>{item.stock_quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg" onClick={() => updateStock(item.id, item.stock_quantity + 1)}>+</Button>
                    </div>
                  </TableCell>
                  <TableCell className="p-4 font-bold text-muted-foreground">Rp {item.price_per_unit.toLocaleString()}</TableCell>
                  <TableCell className="p-4">
                    <Badge className={`${item.stock_quantity > item.min_stock_alert ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border-none uppercase font-black text-[10px]`}>
                      {item.stock_quantity > item.min_stock_alert ? 'Tersedia' : 'Menipis'}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreVertical className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
