// 'use strict'
// const pipePromise = require('../../../../src/utils/pipePromise')

// const populateAddOnVenueId = ({ queryInterface, Sequelize }) =>
//   pipePromise(
//     () =>
//       queryInterface.sequelize.query(`
// UPDATE "AddOn"
// SET "venueId" = evt."venueId"
// FROM (select "AddOnProduct"."addOnId", "Event"."venueId" from "AddOnProduct" left join "Event" ON "Event".id = "AddOnProduct"."eventId") as evt WHERE evt."addOnId" = id`),
//     () => ({ queryInterface, Sequelize }),
//   )()

// const getEventStalls = ({ queryInterface }) =>
//   queryInterface.sequelize.query(`
// DROP AGGREGATE IF EXISTS array_agg_mult (anyarray);
// CREATE AGGREGATE array_agg_mult (anyarray) ( SFUNC = array_cat, STYPE = anyarray, INITCOND = '{}');
// DROP FUNCTION IF EXISTS "getEventStalls"(integer);
// CREATE OR REPLACE FUNCTION "getEventStalls"(integer) RETURNS int[]
//     AS 'SELECT array_agg_mult("assignedStalls") FROM "EventStall" WHERE "eventId" = $1'
//     LANGUAGE SQL
//     IMMUTABLE
//     RETURNS NULL ON NULL INPUT;
// SELECT
//   "Event".id as "eventId",
//   "Event"."pricePerEvent",
//   "Event"."pricePerNight",
//   "Event"."startDate",
//   "Event"."endDate",
//   "getEventStalls"("Event".id) as "assignedStalls"
// FROM "Event";`)

// const buildStallProducts = ([[...eventStalls]]) =>
//   Promise.resolve({
//     eventStalls,
//     stallProducts: eventStalls.reduce(
//       (sum, { eventId, pricePerNight, pricePerEvent, startDate, endDate, assignedStalls }) => [
//         ...sum,
//         ...(parseInt(pricePerNight, 10) !== 0
//           ? [
//               {
//                 name: 'Nightly',
//                 eventId,
//                 nightly: true,
//                 price: parseInt(pricePerNight, 10),
//                 startDate,
//                 endDate,
//                 stallIds: assignedStalls,
//               },
//             ]
//           : []),
//         ...(parseInt(pricePerEvent, 10) !== 0
//           ? [
//               {
//                 name: 'Full Event',
//                 eventId,
//                 nightly: false,
//                 price: parseInt(pricePerEvent, 10),
//                 startDate,
//                 endDate,
//                 stallIds: assignedStalls,
//               },
//             ]
//           : []),
//       ],
//       [],
//     ),
//   })

// const getStallProductBy = ({ queryInterface, Sequelize }) => ({ eventId, name, price }) => () =>
//   queryInterface.sequelize.query(
//     `SELECT id FROM "StallProduct" WHERE "eventId" = ? AND "name" = ? AND "price" = ? ORDER BY id DESC limit 1`,
//     {
//       replacements: [eventId, name, price],
//       type: Sequelize.QueryTypes.SELECT,
//     },
//   )

// const insertStallProductStalls = ({ queryInterface }) => ({ stallIds }) => ([{ id: stallProductId }]) =>
//   stallIds.length > 0 && stallProductId
//     ? queryInterface.bulkInsert(
//         'StallProductStall',
//         stallIds.reduce((sum, stallId, index) => {
//           if (stallIds.indexOf(stallId) === index) {
//             return [
//               ...sum,
//               {
//                 stallProductId,
//                 stallId,
//               },
//             ]
//           }
//           return sum
//         }, []),
//       )
//     : Promise.resolve(null)

// const insertStallProducts = ({ queryInterface, Sequelize }) => ({ stallProducts }) =>
//   pipePromise(
//     stallProducts.map((stallProduct) =>
//       pipePromise(
//         // eslint-disable-next-line no-unused-vars
//         ({ stallIds, eventStallId, ...sp }) => queryInterface.bulkInsert('StallProduct', [sp]),
//         getStallProductBy({ queryInterface, Sequelize })(stallProduct),
//         insertStallProductStalls({ queryInterface, Sequelize })(stallProduct),
//       )(stallProduct),
//     ),
//   )({})

// const migrateStallProducts = ({ queryInterface, Sequelize }) =>
//   pipePromise(getEventStalls, buildStallProducts, insertStallProducts({ queryInterface, Sequelize }), () => ({
//     queryInterface,
//     Sequelize,
//   }))({ queryInterface })

// const getReservations = ({ queryInterface }) => () =>
//   queryInterface.sequelize.query(`
// SELECT
//        "Reservation".id,
//        "Reservation"."eventId",
//        "Reservation"."renterId" as "userId",
//        "Reservation"."stallQuantity" as "quantity",
//        (CASE WHEN "Reservation"."type" = 'nightly'::public."enum_Reservation_type" THEN "Event"."pricePerNight"
//             ELSE  "Event"."pricePerEvent"
//        END) as "price",
//        payment.amount as "total",
//        "Reservation"."notes",
//        "StallProduct".id as "xProductId",
//        (SELECT "ProductXRefType".id FROM "ProductXRefType" WHERE "ProductXRefType"."name" = 'StallProduct') as "xRefTypeId",
//        "Reservation"."statusId",
//        "Reservation"."startDate",
//        "Reservation"."endDate",
//        "Reservation"."assignmentConfirmed",
//        "Reservation"."createdAt",
//        "Reservation"."updatedAt"
// FROM "Reservation"
// LEFT JOIN "Event" ON "Event".id = "Reservation"."eventId"
// LEFT JOIN (SELECT * FROM "Payment" WHERE "success" = TRUE AND "ssRefundId" IS NULL AND "amount" >= 0) as payment ON payment."reservationId" = "Reservation"."id"
// LEFT JOIN "StallProduct" ON "StallProduct"."eventId" = "Reservation"."eventId" AND "StallProduct".nightly = ("Reservation"."type" = 'nightly'::public."enum_Reservation_type");`)

// const buildOrders = ([[...reservations]]) =>
//   reservations.reduce(
//     (
//       sum,
//       {
//         id,
//         eventId,
//         userId,
//         quantity,
//         price,
//         total,
//         notes,
//         xProductId,
//         xRefTypeId,
//         statusId,
//         startDate,
//         endDate,
//         assignmentConfirmed,
//         createdAt,
//         updatedAt,
//       },
//     ) => [
//       ...sum,
//       {
//         order: {
//           userId,
//           eventId,
//           createdAt,
//           updatedAt,
//           fee: 5,
//           total,
//           notes,
//         },
//         orderItem: {
//           orderId: null,
//           xProductId: id, // reservationId
//           xRefTypeId: 4, // Reservation
//           quantity,
//           price,
//         },
//         reservation: {
//           id,
//           statusId,
//           xProductId,
//           xRefTypeId,
//           startDate,
//           endDate,
//           assignmentConfirmed,
//           createdAt,
//           updatedAt,
//         },
//       },
//     ],
//     [],
//   )

// const createOrder = ({ queryInterface }) => ({ order: { userId, eventId, createdAt, updatedAt, fee, total, notes } }) =>
//   queryInterface.sequelize.query(
//     `INSERT INTO "Order" ("userId", "eventId", "createdAt", "updatedAt", "fee", "total", "notes") VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id`,
//     {
//       replacements: [userId, eventId, createdAt, updatedAt, fee, total, notes],
//     },
//   )

// const updateOrderItem = ({ order, orderItem, reservation }) => ([[{ id: orderId }]]) =>
//   Promise.resolve({
//     order,
//     orderItem: {
//       ...orderItem,
//       orderId,
//     },
//     reservation,
//   })

// const createOrders = ({ queryInterface }) => (reservationOrders) =>
//   Promise.all(
//     reservationOrders.map((reservationOrder) =>
//       pipePromise(createOrder({ queryInterface }), updateOrderItem(reservationOrder))(reservationOrder),
//     ),
//   )

// const createOrderItems = ({ queryInterface }) => (orderItems) => queryInterface.bulkInsert('OrderItem', orderItems)

// const updateReservations = ({ queryInterface }) => (reservationOrders) =>
//   Promise.all(
//     reservationOrders.map(({ reservation: { id, xProductId, xRefTypeId } }) =>
//       queryInterface.sequelize.query(`UPDATE "Reservation" SET ("xProductId", "xRefTypeId") = (?, ?) WHERE id = ?`, {
//         replacements: [xProductId, xRefTypeId, id],
//       }),
//     ),
//   )

// const buildReservationAddOnOrderItems = ([[...reservationAddOns]]) =>
//   reservationAddOns.map(({ addOnId: xProductId, quantity, price, orderId }) => ({
//     xProductId,
//     xRefTypeId: 2,
//     quantity,
//     price,
//     orderId,
//   }))

// const createReservationAddOnOrderItems = ({ queryInterface }) =>
//   pipePromise(
//     () =>
//       queryInterface.sequelize.query(`
// SELECT rao.*, ao.price, orderItem."orderId"
// FROM "ReservationAddOn" AS rao
// LEFT JOIN (SELECT ao.*, aop.price FROM "AddOn" AS ao LEFT JOIN "AddOnProduct" AS aop ON aop."addOnId" = ao."id") AS ao ON ao."id" = rao."addOnId"
// LEFT JOIN "OrderItem" AS orderItem ON orderItem."xProductId" = rao."reservationId"
// WHERE rao."deletedAt" IS NULL;`),
//     buildReservationAddOnOrderItems,
//     createOrderItems({ queryInterface }),
//   )

// const updateOldOrderItems = ({ queryInterface }) =>
//   queryInterface.bulkUpdate(
//     'OrderItem',
//     {
//       xRefTypeId: 2,
//     },
//     {
//       xRefTypeId: null,
//     },
//   )

// const updateData = ({ queryInterface }) => (reservationOrders) =>
//   Promise.all([
//     createOrderItems({ queryInterface })(reservationOrders.reduce((sum, { orderItem }) => [...sum, orderItem], [])),
//     updateReservations({ queryInterface })(reservationOrders),
//   ])

// const migrateReservations = ({ queryInterface, Sequelize }) =>
//   pipePromise(
//     getReservations({ queryInterface }),
//     buildOrders,
//     createOrders({ queryInterface }),
//     updateData({ queryInterface }),
//     createReservationAddOnOrderItems({ queryInterface }),
//     updateOldOrderItems({ queryInterface }),
//     () => ({
//       queryInterface,
//       Sequelize,
//     }),
//   )()

// const populatePaymentOrderId = ({ queryInterface, Sequelize }) =>
//   pipePromise(
//     () =>
//       queryInterface.sequelize.query(`
// UPDATE "Payment"
// SET "orderId" = q."orderId"
// FROM (
//     SELECT "Payment".id, res."orderId"
//     FROM "Payment"
//     LEFT JOIN (
//         SELECT "Reservation".id, "OrderItem"."orderId"
//         FROM "Reservation"
//         LEFT JOIN "OrderItem" ON "OrderItem"."xProductId" = "Reservation"."id" AND "OrderItem"."xRefTypeId" = 4
//     ) as res ON res.id = "Payment"."reservationId"
// ) as q WHERE q.id = "Payment".id AND "Payment"."orderId" IS NULL;
// `),
//     () => ({ queryInterface, Sequelize }),
//   )()

// module.exports = {
//   up: (queryInterface, Sequelize) =>
//     pipePromise(
//       populateAddOnVenueId,
//       migrateStallProducts,
//       migrateReservations,
//       populatePaymentOrderId,
//     )
//     ({
//       queryInterface,
//       Sequelize,
//     }),
//   down: async () => {
//     //NOT SUPPORTED
//   },
// }

module.exports = {
  up: async () => {
    // NOT SUPPORTED
  },
  down: async () => {
    // NOT SUPPORTED
  }
};
