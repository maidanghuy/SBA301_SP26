import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

import OrchidForm from "../components/orchid/OrchidForm";
import { orchidService } from "../api/orchidService";
import { categoryService } from "../api/categoryService";

function OrchidFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(id);

  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data));

    if (isEdit) {
      orchidService.getById(id).then((res) => setInitialData(res.data));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const data = {
      orchidName: form.orchidName.value,
      description: form.description.value,
      categoryId: form.categoryId.value,
      image: form.image.value,
      isSpecial: form.isSpecial.checked,
    };

    setLoading(true);

    try {
      if (isEdit) {
        await orchidService.update(id, data);
      } else {
        await orchidService.create(data);
      }

      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isEdit && !initialData) {
    return <Alert variant="info">Loading...</Alert>;
  }

  return (
    <>
      <h3>{isEdit ? "Edit Orchid" : "Create Orchid"}</h3>

      <OrchidForm
        initialData={initialData}
        categories={categories}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </>
  );
}

export default OrchidFormPage;
