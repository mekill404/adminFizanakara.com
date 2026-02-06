import React, { useMemo, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	AiOutlineArrowRight, AiOutlineGlobal,
AiOutlineWarning,
 AiOutlineSearch, AiOutlineClose
} from 'react-icons/ai';

// Hooks
import { useMembers } from '../hooks/useMembers';
import { useFinance } from '../hooks/useFinance';

// Types (Basés sur tes fichiers fournis)
import { PersonResponseModel } from '../lib/types/models/person.models.types';
import { ContributionResponseModel } from '../lib/types/models/contribution.models.types';

// UI
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const Dashboard: React.FC = () => {
	const navigate = useNavigate();
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const [searchTerm, setSearchTerm] = useState("");
	const [showGeoModal, setShowGeoModal] = useState(false);

	const { members: allMembers } = useMembers();
	const { contributions } = useFinance(undefined, selectedYear);

	const stats = useMemo(() => {
		// 1. Total membres (Ici on prend tout car createdAt manque dans ton interface)
		const membersAtYear = allMembers;

		// 2. Calculs financiers (Noms corrigés selon contribution.models.types.ts)
		const totalPaid = contributions.reduce((acc: number, curr: ContributionResponseModel) => 
            acc + (curr.totalPaid || 0), 0
        );
		const totalRemaining = contributions.reduce((acc: number, curr: ContributionResponseModel) => 
            acc + (curr.remaining || 0), 0
        );
		const totalExpected = totalPaid + totalRemaining;
		const progressPercent = totalExpected > 0 ? (totalPaid / totalExpected) * 100 : 0;

		// 3. Top 5 des retards (Utilisation de .remaining)
		const atRisk = [...contributions]
			.filter((c: ContributionResponseModel) => (c.remaining || 0) > 0)
			.sort((a, b) => (b.remaining || 0) - (a.remaining || 0))
			.slice(0, 5);

		return {
			totalMembers: membersAtYear.length,
			totalPaid,
			totalRemaining,
			progressPercent,
			atRisk,
			districts: Array.from(new Set(membersAtYear.map((m: PersonResponseModel) => m.districtName).filter(Boolean))),
			tributes: Array.from(new Set(membersAtYear.map((m: PersonResponseModel) => m.tributeName).filter(Boolean))),
		};
	}, [allMembers, contributions]);

	return (
		<div className="flex flex-col gap-8">
			{/* --- HEADER --- */}
			<header className="flex flex-col lg:flex-row justify-between items-center gap-6">
				<div>
					<h1 className="font-black text-4xl tracking-tighter uppercase">Vue d'ensemble</h1>
					<div className="flex items-center gap-3 mt-4 w-48">
						<Select
							label="Exercice"
							value={selectedYear}
							onChange={(e) => setSelectedYear(Number(e.target.value))}
							options={[...Array(5)].map((_, i) => {
								const y = new Date().getFullYear() - i;
								return { value: y, label: y.toString() };
							})}
						/>
					</div>
				</div>
				<div className="w-full max-w-md">
					<Input
						placeholder="Rechercher un membre..."
						icon={<AiOutlineSearch size={22} />}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</header>

			{/* --- CARTES STATISTIQUES --- */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-white border-2 border-gray-100 border-b-8 p-6 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
					<div className="relative w-20 h-20 mb-4">
						<svg className="w-full h-full" viewBox="0 0 36 36">
							<circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-100" strokeWidth="4"></circle>
							<circle cx="18" cy="18" r="16" fill="none" className="stroke-[#FF4B4B]" strokeWidth="4"
								strokeDasharray={`${stats.progressPercent}, 100`} strokeLinecap="round" transform="rotate(-90 18 18)"></circle>
						</svg>
						<div className="absolute inset-0 flex items-center justify-center text-[#FF4B4B] font-black text-sm">
							{Math.round(stats.progressPercent)}%
						</div>
					</div>
					<p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Collecte Globale</p>
				</div>

				<StatCard title="Inscrits" value={stats.totalMembers} sub="Membres totaux" />
				<StatCard title="Encaissé" value={`${stats.totalPaid.toLocaleString()} Ar`} sub="Flux réel" variant="primary" />
				<StatCard title="Restant" value={`${stats.totalRemaining.toLocaleString()} Ar`} sub="À percevoir" color="text-orange-500" />
			</div>

			{/* --- CONTENU --- */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				<div className="lg:col-span-7 bg-white border-2 border-gray-100 border-b-8 rounded-[3rem] p-8 shadow-xl">
					<div className="flex justify-between items-center mb-8">
						<h3 className="text-sm font-black flex items-center gap-2 uppercase">
							<AiOutlineWarning className="text-orange-500" size={20} /> Retards critiques
						</h3>
					</div>

					<div className="space-y-4">
						{stats.atRisk.map((c: ContributionResponseModel) => (
							<div key={c.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-[#FF4B4B]/20 transition-all">
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[#FF4B4B] border-2 border-gray-100">
										!
									</div>
									<div>
										<p className="font-black text-[11px] uppercase">{c.memberName}</p>
										<p className="text-[8px] text-gray-400 font-black uppercase">Prévu : {c.amount.toLocaleString()} Ar</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-xs font-black text-red-600">-{c.remaining.toLocaleString()} Ar</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="lg:col-span-5 flex flex-col gap-6">
					<Button variant="secondary" onClick={() => navigate('/admin/members')} className="p-6 rounded-3xl border-b-8 flex items-center justify-between group">
						<span className="text-[10px] font-black uppercase tracking-widest">Gérer les membres</span>
						<AiOutlineArrowRight className="group-hover:translate-x-2 transition-transform" />
					</Button>
                    <Button variant="secondary" onClick={() => setShowGeoModal(true)} className="p-6 rounded-3xl border-b-8 flex items-center justify-between group">
						<span className="text-[10px] font-black uppercase tracking-widest">Secteurs & Tribus</span>
						<AiOutlineGlobal className="text-[#FF4B4B]" size={20} />
					</Button>
				</div>
			</div>

			{/* MODAL GÉO (Corrigé avec z-100) */}
			{showGeoModal && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-md z-100 flex items-center justify-center p-6">
					<div className="bg-white w-full max-w-xl rounded-[3rem] p-10 border-2 border-gray-100 border-b-8">
						<div className="flex justify-between items-center mb-8">
							<h2 className="font-black text-xl uppercase">Répertoire Géographique</h2>
							<button onClick={() => setShowGeoModal(false)}><AiOutlineClose size={24} /></button>
						</div>
						<div className="grid grid-cols-2 gap-8">
							<div>
								<p className="text-[9px] font-black text-[#FF4B4B] uppercase mb-4">Districts</p>
								<div className="space-y-2 max-h-60 overflow-y-auto pr-2">
									{stats.districts.map((d: any) => <div key={d} className="p-3 bg-gray-50 rounded-xl text-[10px] font-black uppercase">{d}</div>)}
								</div>
							</div>
							<div>
								<p className="text-[9px] font-black text-gray-400 uppercase mb-4">Tribus</p>
								<div className="space-y-2 max-h-60 overflow-y-auto pr-2">
									{stats.tributes.map((t: any) => <div key={t} className="p-3 bg-gray-50 rounded-xl text-[10px] font-black uppercase">{t}</div>)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

// StatCard helper
const StatCard = ({ title, value, sub, variant = "secondary", color }: any) => (
	<div className={`p-8 rounded-[2.5rem] border-2 border-b-8 ${variant === 'primary' ? 'bg-[#FF4B4B] border-[#FF4B4B] text-white' : 'bg-white border-gray-100'}`}>
		<p className={`text-2xl font-black ${color || ''}`}>{value}</p>
		<p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${variant === 'primary' ? 'opacity-70' : 'text-gray-400'}`}>{title}</p>
		<p className={`text-[8px] font-bold uppercase mt-3 ${variant === 'primary' ? 'opacity-50' : 'text-gray-400/60'}`}>{sub}</p>
	</div>
);

export default memo(Dashboard);