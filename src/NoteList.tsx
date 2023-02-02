import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Stack,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import styles from "./../src/NoteList.module.css";
import { Note, Tag } from "./App";

type NoteListProps = {
  availableTags: Tag[];
  notes: Note[];
  onDelete: any;
  onUpdate: any;
};

type SimplifiedNote = {
  tags: Tag[];
  title: string;
  id: string;
};

const NoteList = ({
  availableTags,
  notes,
  onDelete,
  onUpdate,
}: NoteListProps) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState<string>("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow((p) => !p);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === " " ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length == 0 ||
          selectedTags.every((tag) =>
            note.tags.some((noteTag: any) => noteTag.id === tag.id),
          ))
      );
    });
  }, []);

  return (
    <>
      <Row>
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary">Create </Button>
            </Link>

            <Button variant="outline-secondary" onClick={handleClose}>
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>

      <EditTagsModal
        show={show}
        handleClose={handleClose}
        availableTags={availableTags}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />

      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group>
              <Form.Label> Tags</Form.Label>
              {/* you cannot create new tags */}
              <ReactSelect
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    }),
                  );
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Row xs={1} sm={2} md={3} lg={3} xl={4} className="g-3">
        {filteredNotes.map((note) => (
          <Col key={note.id}>
            <NoteCard id={note.id} title={note.title} tags={note.tags} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default NoteList;

function NoteCard({ id, title, tags }: SimplifiedNote) {
  return (
    <>
      <Card
        as={Link}
        to={`/${id}`}
        className={`h-100 text-reset text-decoration-none ${styles.card}`}
      >
        <Card.Body>
          <Stack
            gap={2}
            className="align-items-center justify-content-center h-100"
          >
            <span className="fs-5">{title} </span>

            {tags?.map((elem, index) => (
              <Badge key={`key--${index}`} className="text-truncate">
                {elem.label}
              </Badge>
            ))}
          </Stack>
        </Card.Body>
      </Card>
    </>
  );
}

function EditTagsModal({
  show,
  handleClose,
  availableTags,
  onUpdate,
  onDelete,
}: any) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {availableTags.map((tag: Tag) => (
              <Row>
                <Col>
                  <Form.Control
                    type="text"
                    value={tag.label}
                    onChange={(e) => {
                      console.log(e.target.value);
                      onUpdate(tag.id, e.target.value);
                    }}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-danger"
                    onClick={() => onDelete(tag.id)}
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
