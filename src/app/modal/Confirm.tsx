import { Button } from "react-bootstrap";

type Props = {
    apply: () => void;
    close: () => void;
};

export default function Confirm({ apply, close }: Props) {
    return (
        <div>
            <i className="fas fa-question-circle fa-3x text-primary mb-3"></i>
            <h5 className="mb-3">Are you sure?</h5>
            <p className="text-muted mb-0">
                This action is irreversible. Please confirm if you want to proceed.
            </p>
            <div className="d-flex justify-content-end">
                <Button variant="outline-secondary" onClick={close}>
                    Close
                </Button>
                <Button variant="primary" onClick={apply} className="ms-2">
                    Apply
                </Button>
            </div>
        </div>
    );
}