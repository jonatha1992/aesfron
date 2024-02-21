import { countries as countriesList } from "countries-list";
import { Country, State } from "country-state-city";

const countries = Country.getAllCountries().map(({ isoCode, name }) => ({
    label: name,
    value: isoCode,
}));

const getStates = (countryIsoCode) => {
    return State.getStatesOfCountry(countryIsoCode).map(({ isoCode, name }) => ({
        label: name,
        value: isoCode,
    }));
};
const getState = async (stateIsoCode, countryIsoCode) => {
    // Primero, obtener todos los estados de un país específico
    const states = await getStates(countryIsoCode);
    // Luego, encontrar el estado específico basado en su isoCode
    const state = states.find((state) => state.value === stateIsoCode);
    // Finalmente, devolver el estado en el formato deseado, o null si no se encuentra
    return state ? { label: state.name, value: state.isoCode } : null;
};

const getCountry = (countryIsoCode) => {
    return countries.find((country) => country.value === countryIsoCode);
};

const countiesCode = Object.keys(countriesList).map((code) => {
    const countieCode = countriesList[code];
    return {
        label: `${countieCode.name} (+${countieCode.phone})`,
        value: `+${countieCode.phone}`,
    };
});

function convertFirebaseTimestampToDate(timestamp) {
    // Convertir a milisegundos
    const dateInMilliseconds = timestamp.seconds * 1000;

    // Crear el objeto Date
    const date = new Date(dateInMilliseconds);

    // Extraer día, mes y año
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses empiezan en 0
    const year = date.getFullYear();

    // Formatear la fecha
    return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}`;
}

export { countries, countiesCode, getStates, getCountry, getState, convertFirebaseTimestampToDate };
