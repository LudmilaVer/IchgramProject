import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() {
    return (
        <div className={styles.footer}>
            <div className={styles.footer_list}>
                <Link to="/" className="p_12SmallGrey">Home</Link>
                <Link to="/search" className="p_12SmallGrey">Search</Link>
                <Link to="/explore" className="p_12SmallGrey">Explore</Link>
                <Link to="/messages" className="p_12SmallGrey">Messages</Link>
                <Link to="/notifications" className="p_12SmallGrey">Notifications</Link>
                <Link to="/create" className="p_12SmallGrey">Create</Link>
                
            </div>
            <div>
                <p className="p_12SmallGrey">© 2024 ICHgram</p>
            </div>
        </div>
    );
}

export default Footer;
