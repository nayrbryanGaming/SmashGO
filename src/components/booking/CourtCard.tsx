// src/components/booking/CourtCard.tsx
'use client'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Info } from 'lucide-react'
import Image from 'next/image'

interface CourtCardProps {
  id: string
  name: string
  venueName: string
  address: string
  price: number
  imageUrl?: string
  status: 'active' | 'maintenance' | 'inactive'
}

export function CourtCard({ name, venueName, address, price, imageUrl, status }: CourtCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-lg group hover:shadow-2xl transition-all duration-300 bg-card">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl || 'https://images.unsplash.com/photo-1626224580175-340ad0e3a7ed?q=80&w=800&auto=format&fit=crop'}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge className={status === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-destructive'}>
            {status === 'active' ? 'Tersedia' : 'Maintenance'}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg leading-tight">{name}</h3>
            <p className="text-sm text-primary font-medium">{venueName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-indigo-600">Rp {price.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">per jam</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{address}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button variant="outline" size="sm" className="flex-1 text-xs">
          <Info className="mr-1 h-3 w-3" /> Info
        </Button>
        <Button size="sm" className="flex-1 text-xs font-bold shadow-md shadow-primary/10">
          Booking
        </Button>
      </CardFooter>
    </Card>
  )
}
