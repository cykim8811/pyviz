'use client';
import Image from 'next/image'
import SocketIOClient from 'socket.io-client'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    const socket = SocketIOClient("http://code.cykim.site:7002");
    socket.on('connect', () => {
      console.log('[Client]: connected', socket.id)
      socket.emit('join', 'pyviz');
    });
  }, []);

  return (
    <Image
      src="/pyviz.svg"
      alt="PyViz Logo"
      width={200}
      height={200}
      // Place at center of page
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', userSelect: 'none' }}
      priority
    />
  )
}
