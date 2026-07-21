'use client';

import dynamic from 'next/dynamic';
import VehicleInsightSection from '@/components/sections/reusable/VehicleInsightSection/VehicleInsightSection';
import styles from './intelligenceInfrastructure.module.css';

const WebGLOrganicFlow = dynamic(() => import('@/components/sections/reusable/WebGLOrganicFlow/WebGLOrganicFlow'), {
    ssr: false,
});

export default function AnimatedVehicleInsight({ vehicleInsightData }: { vehicleInsightData: any }) {
    return (
        <div className={styles.animationSectionWrapper}>
            <div className={styles.webglBackground}>
                <WebGLOrganicFlow />
            </div>
            <VehicleInsightSection {...vehicleInsightData} className={styles.transparentSection} />
        </div>
    );
}
