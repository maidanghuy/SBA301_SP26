import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import PropTypes from "prop-types";

export default function CarForm({
  initial,
  countries = [],
  onSubmit,
  onCancel,
}) {
  const [car, setCar] = useState({
    carName: "",
    countryId: "",
    unitsInStock: 0,
    unitPrice: 0,
    ...(initial || {}),
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // if editing and we only received a countryName, try to look up the id
    // preserve default fields so we don't wipe out initial state values
    let init = {
      carName: "",
      countryId: "",
      unitsInStock: 0,
      unitPrice: 0,
      ...(initial || {}),
    };
    if (!init.countryId && init.countryName && countries.length) {
      const found = countries.find(
        (c) =>
          c.countryName === init.countryName ||
          (c.countryID ?? c.countryId ?? c.id) === init.countryId,
      );
      if (found) {
        init.countryId = found.countryID ?? found.countryId ?? found.id;
      }
    }
    setCar(init);
    // only re-run when the actual identifying fields change
  }, [initial?.carId, initial?.countryName, countries]);

  const validate = () => {
    const errs = {};
    if (!car.carName || car.carName.length <= 10) {
      errs.carName = "Name must be longer than 10 characters";
    }
    if (+car.unitsInStock < 5 || +car.unitsInStock > 20) {
      errs.unitsInStock = "Units in stock must be between 5 and 20";
    }
    // accept numeric id 0 as valid, only reject null/undefined/empty string
    if (
      car.countryId === "" ||
      car.countryId === null ||
      car.countryId === undefined
    )
      errs.countryId = "Country is required";
    if (!car.unitPrice || +car.unitPrice <= 0)
      errs.unitPrice = "Price is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar((c) => ({ ...c, [name]: value }));
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(car);
  };

  return (
    <Form onSubmit={submitForm} className="p-3">
      {errors.form && <Alert variant="danger">{errors.form}</Alert>}
      <Form.Group className="mb-2" controlId="carName">
        <Form.Label>Car name</Form.Label>
        <Form.Control
          name="carName"
          value={car.carName}
          onChange={handleChange}
          isInvalid={!!errors.carName}
        />
        <Form.Control.Feedback type="invalid">
          {errors.carName}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-2" controlId="countryId">
        <Form.Label>Country</Form.Label>
        <Form.Select
          name="countryId"
          value={car.countryId}
          onChange={handleChange}
          isInvalid={!!errors.countryId}
        >
          <option value="">-- choose --</option>
          {countries.map((c) => {
            const id = c.countryID ?? c.countryId ?? c.id;
            return (
              <option key={id} value={id}>
                {c.countryName}
              </option>
            );
          })}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.countryId}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-2" controlId="unitsInStock">
        <Form.Label>Units in stock</Form.Label>
        <Form.Control
          type="number"
          name="unitsInStock"
          value={car.unitsInStock}
          onChange={handleChange}
          isInvalid={!!errors.unitsInStock}
        />
        <Form.Control.Feedback type="invalid">
          {errors.unitsInStock}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-2" controlId="unitPrice">
        <Form.Label>Unit price</Form.Label>
        <Form.Control
          type="number"
          name="unitPrice"
          value={car.unitPrice}
          onChange={handleChange}
          isInvalid={!!errors.unitPrice}
        />
        <Form.Control.Feedback type="invalid">
          {errors.unitPrice}
        </Form.Control.Feedback>
      </Form.Group>
      <div className="d-flex justify-content-end mt-3">
        <Button variant="secondary" onClick={onCancel} className="me-2">
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save
        </Button>
      </div>
    </Form>
  );
}

CarForm.propTypes = {
  initial: PropTypes.object,
  countries: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
