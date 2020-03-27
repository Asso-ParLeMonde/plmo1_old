import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Link,
  InputAdornment,
  IconButton,
  Button,
  Typography
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { LanguagesServiceContext } from "../../services/LanguagesService";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { axiosRequest } from "../axiosRequest";

const frenchClasses = ["CP", "CE1", "CE2", "CM1", "CM2"];

export const DEFAULT_USER = {
  managerFirstName: "",
  managerLastName: "",
  mail: "",
  pseudo: "",
  schoolId: "",
  level: "",
  languageCode: "",
  password: "",
  passwordConfirm: "",
  type: 0 // To be handled by an admin
};

export const TYPES = {
  0: "Classe",
  1: "Admin",
  2: "Super Admin !"
};

// eslint-disable-next-line no-control-regex
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

const checks = {
  managerFirstName: value => value.length > 0,
  managerLastName: value => value.length > 0,
  mail: value => emailRegex.test(value),
  pseudo: value => value.length > 0,
  password: value => strongPassword.test(value),
  passwordConfirm: (value, user) => value === user.password
};

const isPseudoAvailable = async pseudo => {
  const response = await axiosRequest({
    method: "GET",
    url: `/users/test-pseudo/${pseudo}`
  });
  if (response.complete && !response.error) {
    return response.data.available;
  }
  return false;
};

function CreateAccountForm({
  user,
  currentUserPseudo,
  setUser,
  noAutoComplete,
  admin,
  submit,
  buttonLabel,
  slideTop
}) {
  const { getLanguages } = useContext(LanguagesServiceContext);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    managerFirstName: false,
    managerLastName: false,
    mail: false,
    pseudo: false,
    pseudoNotAvailable: false,
    password: false,
    passwordConfirm: false,
    global: false
  });
  const languages =
    getLanguages.complete && !getLanguages.error ? getLanguages.data : [];

  const handleInputChange = userKey => event => {
    event.preventDefault();
    if (userKey === "schoolId") {
      const schoolId = parseInt(event.target.value, 10);
      setUser({ ...user, schoolId: Number.isNaN(schoolId) ? "" : schoolId });
      return;
    }
    setUser({ ...user, [userKey]: event.target.value });
    setErrors(e => ({ ...e, [userKey]: false, global: false }));
  };

  const handleInputValidations = userKey => event => {
    const value = event.target.value || "";
    setErrors(e => ({
      ...e,
      [userKey]: value.length !== 0 && !checks[userKey](value, user)
    }));
    if (
      userKey === "pseudo" &&
      value.length !== 0 &&
      currentUserPseudo !== user.pseudo
    ) {
      isPseudoAvailable(value).then(result => {
        setErrors(e => ({ ...e, pseudoNotAvailable: !result }));
      });
    }
  };

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    // Check form validity
    const userKeys = ["managerFirstName", "managerLastName", "mail", "pseudo"];
    if (!admin) {
      userKeys.push("password", "passwordConfirm");
    }
    let isFormValid = true;
    for (let userKey of userKeys) {
      if (!checks[userKey](user[userKey], user)) {
        isFormValid = false;
        setErrors(e => ({ ...e, [userKey]: true }));
      }
    }
    if (
      user.pseudo.length !== 0 &&
      !(await isPseudoAvailable(user.pseudo)) &&
      currentUserPseudo !== user.pseudo
    ) {
      isFormValid = false;
      setErrors(e => ({ ...e, pseudoNotAvailable: true }));
    }

    if (!isFormValid) {
      setErrors(e => ({ ...e, global: true }));
      slideTop();
      return;
    }

    await submit(user);
  };

  // !!! Fix for bug with select input and default value !!!
  // Maybe can pre-fill with browser language ?
  useEffect(() => {
    const timeout = setTimeout(() => {
      setUser({ ...user, languageCode: "fr" });
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <form
      className="signup-form"
      noValidate
      autoComplete={noAutoComplete ? "off" : ""}
    >
      {errors.global && (
        <Typography variant="caption" color="error">
          Votre inscription comporte des erreurs, veuillez les corriger pour
          continuer.
        </Typography>
      )}
      <TextField
        id="firstname"
        name="firstname"
        type="text"
        color="secondary"
        label="Prénom du professeur"
        value={user.managerFirstName || ""}
        onChange={handleInputChange("managerFirstName")}
        variant="outlined"
        fullWidth
        error={errors.managerFirstName}
        helperText={errors.managerFirstName ? "Requis" : ""}
      />
      <TextField
        id="lastname"
        name="lastname"
        type="text"
        color="secondary"
        label="Nom du professeur"
        value={user.managerLastName || ""}
        onChange={handleInputChange("managerLastName")}
        variant="outlined"
        fullWidth
        error={errors.managerLastName}
        helperText={errors.managerLastName ? "Requis" : ""}
      />
      <TextField
        id="email"
        name="email"
        type="email"
        color="secondary"
        label="E-mail du professeur"
        value={user.mail || ""}
        onChange={handleInputChange("mail")}
        onBlur={handleInputValidations("mail")}
        variant="outlined"
        fullWidth
        error={errors.mail}
        helperText={errors.mail ? "Adresse e-mail non valide." : ""}
      />
      <TextField
        id="username"
        name="username"
        type="text"
        color="secondary"
        label="Pseudo de la classe"
        value={user.pseudo || ""}
        onChange={handleInputChange("pseudo")}
        onBlur={handleInputValidations("pseudo")}
        variant="outlined"
        fullWidth
        error={errors.pseudo || errors.pseudoNotAvailable}
        helperText={
          (errors.pseudo
            ? "Requis | "
            : errors.pseudoNotAvailable
            ? "Pseudo déjà utilisé |"
            : "") + "Utilisé pour la connection par les élèves."
        }
      />
      <FormControl variant="outlined" color="secondary">
        <InputLabel htmlFor="school">École</InputLabel>
        <Select
          native
          value={user.schoolId === undefined ? "" : user.schoolId}
          onChange={handleInputChange("schoolId")}
          label="École"
          inputProps={{
            name: "school",
            id: "school"
          }}
        >
          <option aria-label="None" value="" />
          <option value={0}>Mon école n&apos;apparait pas dans la liste</option>
        </Select>
        {user.schoolId === 0 && (
          <FormHelperText>
            <Link href="#" target="_blank">
              Ajouter mon école ?
            </Link>
          </FormHelperText>
        )}
      </FormControl>
      <Autocomplete
        id="classe"
        freeSolo
        options={frenchClasses}
        onSelect={handleInputChange("level")}
        renderInput={params => (
          <TextField
            {...params}
            label="Niveau de la classe"
            value={user.level || ""}
            onChange={handleInputChange("level")}
            variant="outlined"
            color="secondary"
          />
        )}
      />
      <FormControl variant="outlined" color="secondary">
        <InputLabel htmlFor="languageCode">Langue de préférence</InputLabel>
        <Select
          native
          value={user.languageCode}
          onChange={handleInputChange("languageCode")}
          label="Langue de préférence"
          inputProps={{
            name: "languageCode",
            id: "languageCode"
          }}
        >
          {languages.map(l => (
            <option value={l.value} key={l.id}>
              {l.label}
            </option>
          ))}
        </Select>
      </FormControl>

      {admin ? (
        <FormControl variant="outlined" color="secondary">
          <InputLabel htmlFor="type">Type de compte</InputLabel>
          <Select
            native
            value={user.type || 0}
            onChange={handleInputChange("type")}
            label="Type de compte"
            inputProps={{
              name: "type",
              id: "type"
            }}
          >
            {Object.keys(TYPES).map(typeKey => (
              <option value={typeKey} key={typeKey}>
                {TYPES[typeKey]}
              </option>
            ))}
          </Select>
        </FormControl>
      ) : (
        <React.Fragment>
          <TextField
            type={showPassword ? "text" : "password"}
            color="secondary"
            id="password"
            name="password"
            label="Mot de passe"
            value={user.password || ""}
            onChange={handleInputChange("password")}
            onBlur={handleInputValidations("password")}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleToggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            fullWidth
            error={errors.password}
            helperText={
              errors.password
                ? "Mot de passe trop faible. Il doit contenir au moins 8 charactères avec des lettres minuscules, majuscules et des chiffres."
                : ""
            }
          />
          <TextField
            type={showPassword ? "text" : "password"}
            color="secondary"
            id="passwordComfirm"
            name="passwordComfirm"
            label="Confirmer le mot de passe"
            value={user.passwordConfirm || ""}
            onChange={handleInputChange("passwordConfirm")}
            onBlur={handleInputValidations("passwordConfirm")}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleToggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            fullWidth
            error={errors.passwordConfirm}
            helperText={
              errors.passwordConfirm ? "Mots de passe différents." : ""
            }
          />
        </React.Fragment>
      )}
      <Button
        variant="contained"
        color="secondary"
        type="submit"
        value="Submit"
        onClick={handleSubmit}
      >
        {buttonLabel}
      </Button>
    </form>
  );
}

CreateAccountForm.propTypes = {
  user: PropTypes.object,
  currentUserPseudo: PropTypes.string,
  setUser: PropTypes.func,
  submit: PropTypes.func,
  noAutoComplete: PropTypes.bool,
  admin: PropTypes.bool,
  buttonLabel: PropTypes.string,
  slideTop: PropTypes.func
};

CreateAccountForm.defaultProps = {
  user: DEFAULT_USER,
  currentUserPseudo: "",
  setUser: () => {},
  submit: () => {},
  noAutoComplete: false,
  admin: false,
  buttonLabel: "S'inscrire !",
  slideTop: () => {
    window.scrollTo(0, 0);
  }
};

export default CreateAccountForm;
