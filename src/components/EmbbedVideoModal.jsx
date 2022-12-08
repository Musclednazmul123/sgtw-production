import { Modal } from "@shopify/polaris";
import { useState } from "react"

export default function EmbbedVideoModal({title, open, large, src, message, onCloseCallback}) {
    const [openModal, setOpen] = useState(open || false);
    return (
        <div>
            <Modal
                large={large}
                title={title?title:"Title"}
                src={src?src:null}
                message={message?message:null}
                open={openModal}
                onClose={() => {
                    if (typeof onCloseCallback === "function") {
                        onCloseCallback();
                        setOpen(false);
                    }
                    else{
                        setOpen(false);
                    }
                }}
            ></Modal>
        </div>
    )
}