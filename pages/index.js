import React, { useRef, useEffect, useState } from 'react'
import useMainStore from '../store/store';

import Head from 'next/head';
import Image from 'next/image';

import Layout from '../components/layout';
import Saturn from '../components/saturn';
import styles from '../styles/Home.module.scss';

export default function Home() {
  return (
    <Layout>
      <section className={`2xl:container md:mx-auto h-screen ` + styles.home_wrap}>

        <Saturn></Saturn>

        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }
          * {
            box-sizing: border-box;
          }
        `}</style>
      </section>
    </Layout>
  )
}
