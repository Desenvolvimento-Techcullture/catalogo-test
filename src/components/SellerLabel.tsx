import { useAuth } from '@/contexts/AuthContext';
import { UserCheck } from 'lucide-react';
import React from 'react';
import type { SVGProps } from 'react';

export default function SellerLabel() {
	const { user, isAuthenticated, logout } = useAuth();


	if (user?.role != 'seller') return '';

	return ( 
		<div className="flex items-center gap-2 text-sm bg-muted/50 rounded-md p-3">
		  <UserCheck className="h-4 w-4 text-primary flex-shrink-0" />
		  <div className="flex-1">
			<span className="text-muted-foreground">Vendedor:</span>{" "}
			<span className="font-medium">{user.name}</span>
		  </div>
		</div>
	  );
}