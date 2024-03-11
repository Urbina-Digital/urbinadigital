import React, { useRef, useEffect, useState } from 'react';
import styles from '../styles/Achievement.module.scss';
import Image from 'next/image';

const Achievement = ({ title, description, icon }) => {
  return (
    <div className={styles.achievement}>
      <div className={styles.icon}>
        <h3>{title}</h3>
        {(icon && icon.src) && <Image width={30} height={30} src={icon.src} alt={title} />}
      </div>
      <div className={styles.text}>
        <span>{description}</span>
      </div>
    </div>
  );
}

export default Achievement;