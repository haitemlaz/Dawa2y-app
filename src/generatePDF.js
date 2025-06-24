// utils/generatePrescriptionPDF.js
import QRCode from "qrcode";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

export const generatePDF = async ({
  doctor,
  patient,
  duration,
  medicines,
  prescriptionId,
  calculateAge,
}) => {
  const currentDate = new Date().toLocaleDateString();

  // Encode prescription ID
  // let output = "";
  // const chars = "abcdefghijklmnopqrstuvwxyz";
  // if (prescriptionId.charAt(10) === "-") {
  //   for (let i = 0; i < prescriptionId.length; i++) {
  //     if (i === 10) {
  //       output += "-";
  //     } else {
  //       output += chars.charAt(parseInt(prescriptionId.charAt(i)) + 5);
  //     }
  //   }
  // }
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let output = "";
  if (prescriptionId.charAt(10) === "-") {
    for (let i = 0; i < prescriptionId.length; i++) {
      if (i === 10) {
        output += "-";
      } else {
        const digit = parseInt(prescriptionId.charAt(i));
        output += isNaN(digit) ? "x" : chars.charAt(digit + 5);
      }
    }
  } else {
    output = prescriptionId; // fallback if not in expected format
  }

  const qrDataURL = await QRCode.toDataURL(output);

  const docDefinition = {
    pageSize: { width: 400, height: 550 },
    pageMargins: [20, 40, 20, 0],
    content: [
      {
        columns: [
          {
            stack: [
              { text: `Dr. ${doctor.name}`, style: "doctorName" },
              {
                text: `Specialty: ${doctor.speciality}`,
                style: "doctorSpecialty",
              },
            ],
          },
          {
            stack: [
              { text: doctor.adress, style: "doctorAddress" },
              { text: `Phone: ${doctor.tlf}`, style: "doctorPhone" },
            ],
            alignment: "right",
          },
        ],
      },
      { text: "PRESCRIPTION", style: "title" },
      {
        table: {
          widths: ["*", "auto"],
          body: [
            [
              { text: `Patient Name: ${patient.name}`, style: "patientInfo" },
              { text: `Date: ${currentDate}`, style: "patientInfo" },
            ],
          ],
        },
        layout: "noBorders",
      },
      {
        table: {
          widths: ["*", "auto"],
          body: [
            [
              {
                text: `Age: ${calculateAge(patient["birth date"])}`,
                style: "patientInfo",
              },
              {
                text: `Treatment Duration: ${duration}`,
                style: "patientInfo",
              },
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 3],
      },
      { text: "Medicines:", style: "title2" },
      {
        ul: medicines.map((medicine) => {
          let days = medicine.repititionAfter == 1 ? "day" : " days";
          let interval =
            medicine.repititionAfter == 1 ? "" : ` ${medicine.repititionAfter}`;
          return {
            text: [
              `${medicine.quantity} `,
              { text: medicine.medName, bold: true },
              ` (${medicine.dose}) - ${medicine.tasks.length} times every${interval}${days}`,
            ],
            margin: [0, 5],
          };
        }),
        margin: [0, 10],
      },
      {
        text: "Doctor's Signature:",
        fontSize: 14,
        bold: true,
        margin: [0, 30],
      },
      {
        image: qrDataURL,
        width: 80,
        alignment: "center",
        margin: [0, 30, 0, 5],
      },
      {
        text: prescriptionId,
        alignment: "center",
        fontSize: 10,
      },
    ],
    styles: {
      title: {
        fontSize: 18,
        bold: true,
        alignment: "center",
        margin: [0, 20, 0, 10],
      },
      title2: {
        fontSize: 16,
        bold: true,
        alignment: "center",
        margin: [0, 10, 0, 10],
      },
      patientInfo: { fontSize: 12, margin: [0, 5] },
      doctorName: { fontSize: 12, bold: true },
      doctorSpecialty: { fontSize: 10 },
      doctorAddress: { fontSize: 10 },
      doctorPhone: { fontSize: 10 },
    },
  };

  pdfMake.createPdf(docDefinition).download("prescription.pdf");
};
