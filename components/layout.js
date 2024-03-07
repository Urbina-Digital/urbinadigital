import styles from '../styles/layout.module.scss';
import { faBars, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function Layout({ children }) {

  return (
  <div
    className={`flex flex-nowrap flex-col justify-center content-center` + styles.container}>
    
    {children}
  </div>);
}