const ESV_API =
  "https://api.esv.org/v3/passage/";

const ALLOWED_ORIGINS = [
  "https://YOUR-GITHUB-USERNAME.github.io"
];


export default {

  async fetch(request, env) {

    const url =
      new URL(request.url);


    const origin =
      request.headers.get("Origin") || "";


    const corsHeaders = {

      "Access-Control-Allow-Origin":
        ALLOWED_ORIGINS.includes(origin)
          ? origin
          : ALLOWED_ORIGINS[0],

      "Access-Control-Allow-Methods":
        "GET, OPTIONS",

      "Access-Control-Allow-Headers":
        "Content-Type",

      "Access-Control-Max-Age":
        "86400"

    };


    if (
      request.method === "OPTIONS"
    ) {

      return new Response(
        null,
        {
          status: 204,
          headers: corsHeaders
        }
      );

    }


    /*
     * /passage
     */

    if (
      url.pathname === "/passage"
    ) {

      const q =
        url.searchParams.get("q");


      if (!q) {

        return json(
          {
            error:
              "Missing q"
          },
          400,
          corsHeaders
        );

      }


      const apiUrl =
        new URL(
          ESV_API + "text/"
        );


      apiUrl.searchParams.set(
        "q",
        q
      );


      apiUrl.searchParams.set(
        "include-headings",
        "false"
      );


      apiUrl.searchParams.set(
        "include-footnotes",
        "false"
      );


      apiUrl.searchParams.set(
        "include-verse-numbers",
        "true"
      );


      apiUrl.searchParams.set(
        "include-short-copyright",
        "true"
      );


      apiUrl.searchParams.set(
        "include-passage-references",
        "false"
      );


      apiUrl.searchParams.set(
        "line-length",
        "0"
      );


      const response =
        await fetch(
          apiUrl.toString(),
          {

            headers: {

              "Authorization":
                "Token " +
                env.ESV_API_KEY

            }

          }
        );


      const body =
        await response.text();


      return new Response(
        body,
        {

          status:
            response.status,

          headers: {

            ...corsHeaders,

            "Content-Type":
              "application/json"

          }

        }
      );

    }


    /*
     * /audio
     *
     * ESV audio endpoint returns
     * an MP3 redirect.
     *
     * Worker follows that redirect
     * and streams the MP3 to the browser.
     */

    if (
      url.pathname === "/audio"
    ) {

      const q =
        url.searchParams.get("q");


      if (!q) {

        return new Response(
          "Missing q",
          {
            status: 400,
            headers: corsHeaders
          }
        );

      }


      const apiUrl =
        new URL(
          ESV_API + "audio/"
        );


      apiUrl.searchParams.set(
        "q",
        q
      );


      const response =
        await fetch(
          apiUrl.toString(),
          {

            redirect:
              "follow",

            headers: {

              "Authorization":
                "Token " +
                env.ESV_API_KEY

            }

          }
        );


      if (!response.ok) {

        return new Response(
          await response.text(),
          {

            status:
              response.status,

            headers:
              corsHeaders

          }
        );

      }


      const headers =
        new Headers(
          corsHeaders
        );


      headers.set(
        "Content-Type",
        "audio/mpeg"
      );


      headers.set(
        "Cache-Control",
        "public, max-age=3600"
      );


      return new Response(
        response.body,
        {

          status: 200,

          headers

        }
      );

    }


    return json(
      {
        error:
          "EBRM API not found"
      },
      404,
      corsHeaders
    );

  }

};


function json(
  data,
  status,
  headers
) {

  return new Response(
    JSON.stringify(data),
    {

      status,

      headers: {

        ...headers,

        "Content-Type":
          "application/json"

      }

    }
  );

}