"use client";
 
 import React, { CSSProperties } from "react";
 import styles from "./OpenApplicationSection.module.css";
 import JobApplicationForm from "@/app/(pages)/[locale]/careers/[slug]/JobApplicationForm";
 
 interface OpenApplicationSectionProps {
   title: string;
   subheading: string;
   backgroundImage: string;
 }
 
 const OpenApplicationSection: React.FC<OpenApplicationSectionProps> = ({
   title,
   subheading,
   backgroundImage,
 }) => {
   const sectionStyle: CSSProperties = backgroundImage
     ? {
         backgroundImage: `url(${backgroundImage})`,
         backgroundSize: 'cover',
         backgroundPosition: 'center',
         backgroundRepeat: 'no-repeat',
       }
     : {};
 
   return (
     <section className={styles.section} style={sectionStyle}>
       <div className="container">
         <div className={styles.content}>
           <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
           <p className={styles.subheading}>{subheading}</p>
           <div className={styles.formWrapper}>
             <JobApplicationForm 
               mode="mini" 
               jobTitle="Open Application" 
             />
           </div>
         </div>
       </div>
     </section>
   );
 };
 
 export default OpenApplicationSection;
