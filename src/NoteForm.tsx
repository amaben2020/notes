import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { v4 as uuidV4 } from "uuid";
import { NoteData, Tag } from "./App";

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
} & Partial<NoteData>;

const NoteForm = ({
  onSubmit,
  onAddTag,
  availableTags,
  title = "",
  markdown = "",
  tags = [],
}: NoteFormProps) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);

  const navigate = useNavigate();

  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      // enforcing non nullable
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
    });

    // go to home page
    navigate("..");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label> Title</Form.Label>
              <Form.Control required ref={titleRef} defaultValue={title} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label> Tags</Form.Label>
              <CreatableReactSelect
                onCreateOption={(label) => {
                  const newTag = { id: uuidV4(), label };
                  onAddTag(newTag);
                  setSelectedTags((prev) => [...prev, newTag]);
                }}
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

        <Row>
          <Col>
            <Form.Group>
              <Form.Label> Body</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={15}
                ref={markdownRef}
                defaultValue={markdown}
              />
            </Form.Group>

            <Stack direction="horizontal" className="justify-content-end">
              <Button type="submit" variant="primary">
                Save
              </Button>
              {/* takes us to home */}
              <Link to="..">
                <Button type="button" variant="outline-secondary">
                  Cancel
                </Button>
              </Link>
            </Stack>
          </Col>
        </Row>
      </Stack>
    </Form>
  );
};

export default NoteForm;
