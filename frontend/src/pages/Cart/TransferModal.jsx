import React, {useState} from 'react'
import { Copy } from "lucide-react";
import './TransferModal.css'
import { assets } from '../../assets/assets';

const TransferModal = ({ setIsModalOpen }) => {
    const [copied, setCopied] = useState("");

    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(""), 2000);
    };

    return (
        <div className='transfer-window'>
            <div className="transfer-window-container">
                <div className='title'>
                    <h3>Datos Bancarios para Transferencia</h3>
                    <img className='cross' onClick={() => { setIsModalOpen(false) }} src={assets.cross_icon} alt="" />
                </div>
                <div className="info-row">
                    <span><strong>Banco:</strong> BBVA</span>
                </div>
                <div className="info-row">
                    <span><strong>Número de Cuenta:</strong> 1234567890</span>
                    <Copy className="icon" onClick={() => handleCopy("1234567890", "Cuenta")} />
                </div>
                <div className="info-row">
                    <span><strong>CLABE:</strong> 012345678901234567</span>
                    <Copy className="icon" onClick={() => handleCopy("012345678901234567", "Clabe")} />
                </div>
                <div className="info-row">
                    <span><strong>Nombre:</strong> Juan Pérez</span>
                    <Copy className="icon" onClick={() => handleCopy("Juan Pérez", "Nombre")} />
                </div>
                {copied && <p className="copied">¡{copied} copiado!</p>}
            </div>
        </div>

    )
}

export default TransferModal