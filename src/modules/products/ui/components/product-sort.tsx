"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useProductFilters } from "../../hooks/use-product-filters";

type SortOptionValue = "curated" | "trending" | "hot_and_new";

const sortOptions = [
	{ value: "curated" as SortOptionValue, label: "Curated" },
	{ value: "trending" as SortOptionValue, label: "Trending" },
	{ value: "hot_and_new" as SortOptionValue, label: "Hot & New" },
];

interface SortButtonProps {
	value: SortOptionValue;
	label: string;
	isActive: boolean;
	onClick: () => void;
}

const SortButton = ({ label, isActive, onClick }: SortButtonProps) => (
	<Button
		size="sm"
		className={cn(
			"rounded-full bg-white",
			!isActive && "bg-transparent"
		)}
		variant="reverse"
		onClick={onClick}
	>
		{label}
	</Button>
);

export const ProductSort = () => {
	const [filters, setFilters] = useProductFilters();

	return (
		<div className="flex items-center gap-2">
			{sortOptions.map((option) => (
				<SortButton
					key={option.value}
					value={option.value}
					label={option.label}
					isActive={filters.sort === option.value}
					onClick={() => setFilters({ sort: option.value })}
				/>
			))}
		</div>
	);
};
